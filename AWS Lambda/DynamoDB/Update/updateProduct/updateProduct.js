'use strict';
// Global variables and dependencies
var AWS = require('aws-sdk');
var dynamoDB = new AWS.DynamoDB({ region : 'us-west-2' });

exports.updateProduct = function (event, context) {
    
    var message = {
            succeed : "succeed",
            failed : "failed"
    };
    
    if (!event.productId || !event.name || !event.tags || event.category || event.description) {
        context.fail(message.failed);
    } else {
        
        var params = {
            "TableName" : "products",
            "Key" : {
                "product_id" : event.productId
            },
            "AttributeUpdates" : {
                "name" : { "S" : event.name },
                "tags" : { "S" : event.tags },
                "category_id" : { "S" : event.category },
                "description" : { "S" : event.description }
            }
        };
        
        dynamoDB.updateItem(params, function (err, data) {
            if (err) {
                context.fail(message.failed);
            } else {
                context.succeed(message.succeed);
            }
        });
    }
};