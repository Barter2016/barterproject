const md5 = require('md5');
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB({region: 'us-west-2'});

/**
 * This function adds a category to the databse.
 */
exports.addCategory = function(event, context){

    const messages  = {
        "succeed" : "succeed",
        "failed" : "fail"
    };

    if(!event.category_id){
        context.fail(messages.failed);
    }
    if(!event.category_name){
        context.fail(messages.failed);
    }

    const params = {
        TableName:"categories",
        Item:{
            "category_id": {"S" : md5(event.category_id)},
            "category_name": {"S" : event.category_id}
        }
    };

    dynamoDB.putItem(params, function (err, data) {
        if (err) {
            context.fail(messages.failed);
        } else {
            context.succeed(messages.succeed);
        }
    });
}