'use strict';
// Global variables and dependencies
var AWS = require('aws-sdk');
var dynamoDB = new AWS.DynamoDB({ region : 'us-west-2' });

exports.updateProduct = function (event, context) {
    
    var message = {
            succeed : "succeed",
            failed : "failed"
    };
    
    if (!event.product_id || !event.name || !event.tags || !event.category || !event.description) {
        context.fail(message.failed);
    } else {
        
        var params = {
            "TableName" : "products",
            "Key" : {
                "product_id" : { "S" : event.product_id }
            },
            "AttributeUpdates" : {
                "name" : { "Value" : { "S" : event.name }},
                "tags" : { "Value" : { "S" : event.tags }},
                "category_id" : { "Value" : { "S" : event.category }},
                "description" : { "Value" : { "S" : event.description }}
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