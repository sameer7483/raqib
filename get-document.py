import json
import boto3
from botocore.exceptions import ClientError
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table_name = 'raqib-db'
table = dynamodb.Table(table_name)

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return int(obj)
    raise TypeError

def lambda_handler(event, context):
    id = event['queryStringParameters']['id']
    try:
        # Retrieve the document from DynamoDB using the id
        response = table.get_item(Key={'id': id})
        document = response.get('Item')
        if document:
            return {
                'statusCode': 200,
                'body': json.dumps(document, default = decimal_default)
            }
        else:
            return {
                'statusCode': 404,
                'body': json.dumps('Document not found')
            }
    except ClientError as e:
        print('Unable to get document:', e.response['Error']['Message'])
        return {
            'statusCode': 500,
            'body': json.dumps('Unable to get document')
        }
