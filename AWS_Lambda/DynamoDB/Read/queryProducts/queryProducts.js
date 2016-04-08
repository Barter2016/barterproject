const AWS = require('aws-sdk')
const dynamoDB = new AWS.DynamoDB({ region: 'us-west-2' })
const async = require('async')

/*
* Queries and returns an array of products.
*/
exports.queryProducts = function(event, context) {
    
    const messages = {
        argument_null : 'The array of product id has not been provided',
        failed: 'Failed to execute a query function on the product',
    };
    
    if(!event.products_array){
        context.fail(messages.argument_null);
    }
    
    var productsArray = [];
    var result = {
        productsArray: []
    };
    async.each(event.products_array, function (product_id, callback) {
        const params = {
            TableName: 'products',
            KeyConditionExpression: "product_id = :product_id",
            ExpressionAttributeValues: {
                ":product_id" : { "S" : product_id }
            }
        };
        dynamoDB.query(params, function (err, productObj) {
            if(err) {
                result.err = err
                callback(result);
            } else {
                result.productsArray.push(JSON.stringify(productObj))
                console.log(result.productsArray)
                callback(result)
            }
        })
    }, function (result) {
        if (result.err) {
            context.fail(result.err)
        }
        context.succeed(result.productsArray)
    })
    
};