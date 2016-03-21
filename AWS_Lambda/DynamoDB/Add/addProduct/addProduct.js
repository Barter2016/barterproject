// Gloabal variables and dependencies
const md5 = require('md5');
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB({ region : 'us-west-2' });

/*
* This function adds a product in the product table of the database.
*
* param="event" The persistent datas gotten from the request.
* param="context" The informations about the function.
*/
exports.addProduct = function (event, context) {
    
    const message = {
            succeed : "succeed",
            failed : "failed"
    };
    console.log(JSON.stringify(event));
    if (!event.product_name 
        || !event.user_email
        || !event.product_tags 
        || !event.category_id 
        || !event.product_description) {
        context.fail(message.failed);
    } else {
										
        const queryCategoryParams = {			
            TableName: 'categories',
            KeyConditionExpression: "category_id = :category_id",
            ExpressionAttributeValues: {
                ":category_id":  { "S" :event.category_id }
            }
        }
        
        dynamoDB.query(queryCategoryParams, function(err, category) {	
            if(err) {
                context.fail(err)
            }  
            else {
				console.log(category.Items[0].category_id)
				console.log(category.Items[0].category_name)
				
                const date = new Date()	
                const productId = event.user_email + date.getTime()
                const hashedProductId = md5(productId)
                
                const params = {
                    "TableName": "products",
                    "Item" : {
                        "product_id" : { "S" : hashedProductId },
                        "user_email" : { "S" : event.user_email },
                        "product_name" : { "S" : event.product_name },
                        "product_tags" : { "S" : event.product_tags },
                        "category_id" : { "S" : category.Items[0].category_id.S },
						"category_name" : { "S" : category.Items[0].category_name.S },
                        "product_description" : { "S" : event.product_description }
                    }
                }
                
                dynamoDB.putItem(params, function (err, data) {
                    if (err) {
                        context.fail(err)
                    } else {
                        context.succeed(message.succeed)
                    }
                })
            }
        })
    }
};