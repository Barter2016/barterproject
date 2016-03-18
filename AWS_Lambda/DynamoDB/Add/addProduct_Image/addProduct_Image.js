const md5 = require('md5');
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB({region: 'us-west-2'});

/**
 * This function adds a item to the product_images table.
 */
exports.addProduct_Image = function(event, context){

    const messages  = {
        "succeed" : "succeed",
        "failed" : "failed"
    };

    if(!event.product_images_id){
        context.fail(messages.failed);
    }
    if(!event.product_id){
        context.fail(messages.failed);
    }
    if(!event.product_images_url){
         context.fail(messages.failed);
    }

    const params = {
        TableName:"product_images",
        Item:{
            "product_image_id": {"S" : md5(event.product_images_id)},
            "product_id": {"S" : event.product_id},
            "product_image_url": {"S" : event.product_images_url}
        }
    };

    dynamoDB.putItem(params, function (err, data) {
        if (err) {
            context.fail(messages.failed);
        } else {
            context.succeed(messages.succeed);
        }
    });
};