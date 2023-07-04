import boto3
import json
# Create DocumentDB client
dynamodb = boto3.client('dynamodb')

def perform_scan(order_id=None, product_id=None, seq_num=None):
    # Build the filter expression based on the provided input fields
    filter_expression = []

    if order_id:
        filter_expression.append("orderId = :order_id")

    if product_id:
        filter_expression.append("productId = :product_id")

    if seq_num and (order_id or product_id):
        filter_expression.append("seqNum = :seq_num")

    if not filter_expression:
        # No valid input fields provided
        return []

    # Build the expression attribute values
    expression_attribute_values = {}
    if order_id:
        expression_attribute_values[":order_id"] = {"S": order_id}

    if product_id:
        expression_attribute_values[":product_id"] = {"S": product_id}

    if seq_num and (order_id or product_id):
        expression_attribute_values[":seq_num"] = {"S": seq_num}

    # Execute the scan operation with the filter expression
    response = dynamodb.scan(
        TableName='raqib-db',
        FilterExpression=' AND '.join(filter_expression),
        ExpressionAttributeValues=expression_attribute_values
    )

    # Process the scan results
    items = []
    for item in response['Items']:
        simplified_item = {}
        for key, value in item.items():
            simplified_item[key] = list(value.values())[0]  # Extract the value from the DynamoDB data type
        items.append(simplified_item)

    return items

def lambda_handler(event, context):
    data = json.loads(event['body'])
    order_id = data.get('orderId')
    product_id = data.get('productId')
    seq_num = data.get('seqNum')

    # Validate that at least one of the fields is provided and seqNum is not alone
    if not (order_id or product_id or seq_num) or (seq_num and not (order_id or product_id)):
        return {
            'statusCode': 400,
            'body': json.dumps('Invalid input. Please provide at least one of orderId, productId, or seqNum.'),
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                }             
            }

    # Perform the scan query based on the provided input fields
    items = perform_scan(order_id, product_id, seq_num)

    return {
        'statusCode': 200,
        'body': json.dumps(items),
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            }         
    }
