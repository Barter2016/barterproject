const md5 = require('md5');
const AWS = require('aws-sdk');

exports.addOffer = function(event, context) {
    
    if(!event.productsOffered
        && event.productsOffered.length < 1) {
        context.fail("There's no product to offer.")  
    }
    
    if(!event.sender) {
        context.fail("The sender can not be undefined.")
    }
    
    if(!event.sender_name) {
        context.fail("The sender name can not be undefined.")
    }
    
    if(!event.sender_picture) {
        context.fail("The sender picture can not be undefined.")
    }
    
    if(!event.receiver) {
        context.fail("The receiver can not be undefined.")
    }
    
    if(!event.targetedProduct) {
        context.fail("The targeted product can not be undefined.")
    }
    
    // Set the database connection here.
    const dynamoDB = new AWS.DynamoDB({ region : 'us-west-2' })
    
    const now = new Date()
    const offerId = md5(event.sender + now.getTime())
	
    const params = {
        "TableName": "offers",
        "Item": {
            "offer_id": { "S": offerId },
            "products_offered": { 
                "SS": event.productsOffered
            },
            "sender": { "S": event.sender },
            "sender_name": { "S": event.sender_name },
            "sender_picture": { "S": event.sender_picture },
            "receiver": { "S" : event.receiver },
            "targeted_product": { "S": event.targetedProduct.product_id.S },
            "date_created": { "S": now.toString() },
            "offer_read": { "BOOL": false }
        }
    }
    
    dynamoDB.putItem(params, function(err, data) {
        if(err) {
            context.fail(err)
        }
        context.succeed(data)
    })
    
}