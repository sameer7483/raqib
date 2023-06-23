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
    data = json.loads(event['body'])
    id = data.get('id')
    new_status = data.get('status')
    
    try:
        # Update the status of the document in DynamoDB
        response = table.update_item(
            Key={'id': id},
            UpdateExpression='SET #s = :val',
            ExpressionAttributeNames={'#s': 'status'},
            ExpressionAttributeValues={':val': new_status},
            ReturnValues='ALL_NEW'
        )
        updated_document = response.get('Attributes')
        
        if updated_document:
            return {
                'statusCode': 200,
                'body': json.dumps(updated_document, default = decimal_default)
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
