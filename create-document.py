import json
from enum import Enum
import boto3
from botocore.exceptions import ClientError, NoCredentialsError
from datetime import datetime
import qrcode
from io import BytesIO
# from PIL import Image, ImageDraw, ImageFont

# Configure AWS SDK
dynamodb = boto3.resource('dynamodb')
table_name = 'raqib-db'
table = dynamodb.Table(table_name)
s3 = boto3.client('s3')
bucket_name = 'raqib-storage'

class Status(Enum):
    DEFAULT = 0
    ON_LOOM = 1
    OFF_LOOM = 2
    WASHING = 3
    LATEXING = 4
    FINISHING = 5
    PACKING = 6
    SHIPPED = 7
    DELIVERED = 8
    
def add_name_below_qr_code(image, name):
    qr_code_image = image.convert("RGBA")
    name_font = ImageFont.truetype("Arial.ttf", size=30)  # Customize the font and size as needed

    # Calculate the position to place the name text
    name_text_width, name_text_height = name_font.getsize(name)
    qr_code_width, qr_code_height = qr_code_image.size
    name_text_position = ((qr_code_width - name_text_width) // 2, qr_code_height + 10)

    # Create a new image with extended height to accommodate the name text
    final_image = Image.new("RGBA", (qr_code_width, qr_code_height + name_text_height + 20), "white")
    final_image.paste(qr_code_image, (0, 0))

    # Draw the name text on the final image
    draw = ImageDraw.Draw(final_image)
    draw.text(name_text_position, name, font=name_font, fill="black")

    return final_image

def generate_qr_code(data, id):
    qr = qrcode.QRCode(
        version=3,  # QR code version (adjust as needed)
        error_correction=qrcode.constants.ERROR_CORRECT_M,  # Error correction level
        box_size=10,  # Size of each box in the QR code
        border=4  # Border size around the QR code
    )
    qr.add_data(data)  # Data to be encoded in the QR code
    qr.make(fit=True)

    image = qr.make_image(fill_color="black", back_color="white")  # QR code colors
    # image = add_name_below_qr_code(image, id)
    # Save the generated QR code image to AWS S3
    image_bytes = BytesIO()
    image._img.write(image_bytes, image.rows_iter())
    try:
        image_bytes.seek(0)
        s3.put_object(Body=image_bytes, Bucket=bucket_name, Key=id)
        print("QR code uploaded to AWS S3 successfully!")
    except NoCredentialsError:
        print("Unable to upload QR code to AWS S3. AWS credentials not found.")
        
def lambda_handler(event, context):
    data = json.loads(event['body'])
    order_id = data.get('orderId')
    product_id = data.get('productId')
    seq_num = data.get('seqNum')
    id = '-'.join([order_id, product_id, str(seq_num)])
    url = f'https://l7hzx92wwi.execute-api.us-east-1.amazonaws.com/default/raqib-get-document?id={id}'
    generate_qr_code(url, id)
    # Create a new document with the required attributes
    document = {
        'id': id,
        'orderId': order_id,
        'productId': product_id,
        'seqNum': seq_num,
        'status': Status.DEFAULT.value,
        'creationDate': datetime.now().isoformat()
    }
    
    try:
        response = table.get_item(Key={'id': id})
        existing_document = response.get('Item')
        if existing_document:
            return {
                'statusCode': 200,
                'body': json.dumps({'error': 'Item already exists'}),
                'headers': {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                    },
            }        
        response = table.put_item(Item=document)
        return {
            'statusCode': 200,
            'body': json.dumps({'id': id}),
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                }           
        }
    except ClientError as e:
        print('Unable to create document:', e.response['Error']['Message'])
        return {
            'statusCode': 500,
            'body': json.dumps('Unable to create document'),
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                }             
           
        }
