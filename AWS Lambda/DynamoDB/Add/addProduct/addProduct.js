'use strict';
// Gloabal variables and dependencies
var md5 = require('md5');
var AWS = require('aws-sdk');
var dynamoDB = new AWS.DynamoDB({ region : 'us-west-2' });

/*
* This function adds a product in the product table of the database
*
* param="event" The persistent datas gotten from the request.
* param="context" The informations about the function.
*/
exports.addProduct = function (event, context) {
    
    if (!event.name || !event.email || !event.tags || !event.category || !event.description) {
        context.fail("The description of the product can't be null");
    } else {
        var date = new Date();
        var productId = event.email + date.getTime();
        var hashedProductId = md5(productId);
        
        var params = {
            "TableName": "products",
            "Item" : {
                "products_id" : { "S" : hashedProductId },
                "email" : { "S" : event.email },
                "name" : { "S" : event.name },
                "tags" : { "S" : event.tags },
                "category_id" : { "S" : event.category },
                "description" : { "S" : event.description }
            }
        };
        
        dynamoDB.putItem(params, function (err, data) {
            if (err) {
                context.fail("Unable to add item. Error: " + err);
            } else {
                context.succeed("Added item " + JSON.stringify(data));
            }
        });
    }
};