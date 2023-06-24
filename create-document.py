import json
from enum import Enum
import boto3
from botocore.exceptions import ClientError
from datetime import datetime


# Configure AWS SDK
dynamodb = boto3.resource('dynamodb')
table_name = 'raqib-db'
table = dynamodb.Table(table_name)

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

def lambda_handler(event, context):
    data = json.loads(event['body'])
    order_id = data.get('orderId')
    product_id = data.get('productId')
    seq_num = data.get('seqNum')
    id = '-'.join([order_id, product_id, str(seq_num)])
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
        response = table.put_item(Item=document)
        return {
            'statusCode': 200,
            'body': json.dumps({'id': id})
        }
    except ClientError as e:
        print('Unable to create document:', e.response['Error']['Message'])
        return {
            'statusCode': 500,
            'body': json.dumps('Unable to create document')
        }
