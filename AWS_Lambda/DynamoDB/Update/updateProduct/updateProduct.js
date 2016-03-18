// Global variables and dependencies
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB({ region : 'us-west-2' });

/*
* This function updates a product in the products table of the database.
*/
exports.updateProduct = function (event, context) {
    
    const message = {
            succeed : "succeed",
            failed : "failed"
    };
    
    if (!event.product_id || !event.product_name || !event.product_tags || !event.category_id || !event.product_description) {
        context.fail(message.failed);
    } else {
        
        const params = {
            "TableName" : "products",
            "Key" : {
                "product_id" : { "S" : event.product_id }
            },
            "AttributeUpdates" : {
                "product_name" : { "Value" : { "S" : event.product_name }},
                "product_tags" : { "Value" : { "S" : event.product_tags }},
                "category_id" : { "Value" : { "S" : event.category_id }},
                "product_description" : { "Value" : { "S" : event.product_description }}
            }
        };
        
        dynamoDB.updateItem(params, function (err, data) {
            if (err) {
                context.fail(err);
            } else {
                context.succeed(message.succeed);
            }
        });
    }
};