const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB({ region : 'us-west-2' });
const async = require("async");

/*
 * This function scans all the read messages by its message_receiver_email.
 *
 * @param receiver_email The email of the user to get the messages from. 
 * @param callback The callback of the function.
 */
function queryMessagesByReceiver (receiver_email, callback) {
    const params = {
        TableName: 'messages',
        FilterExpression : 'message_receiver_email = :receiver_email AND message_read = :read_messages',
        ExpressionAttributeValues : {
            ':receiver_email' : { 'S' : receiver_email },
            ':read_messages' : { 'BOOL' : true }
        }
    };
    
    dynamoDB.scan(params, function(err, readMessages) {
        if(err) {
            callback(err, null);
        } else {
            callback(null, JSON.stringify(readMessages));
        }
    });
}

/*
 * This function deletes an item from the messages table.
 *
 * @param message_id The id of the message.
 */    
function deleteSingleReadMessageByReceiver(message_id, callback) {
    console.log('test')
    const params = {
        "TableName" : "messages",
        "Key" : { 
            "message_id" : { "S" : message_id }
        }
    };

    dynamoDB.deleteItem(params, function (err, data) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, data);
        }
    });
}    
    
/**
 * This function removes all the read message of a user from the database.
 */
exports.deleteReadMessagesByReceiver = function(event, context){
    const messages  = {
        "succeed" : "succeed",
        "failed" : "fail"
    };

    if(!event.message_receiver_email){
        context.fail(messages.failed);
    }
    
    queryMessagesByReceiver(event.message_receiver_email, function (err, readMessagesList) {
        if (err) {
            context.fail(messages.failed);
        }
        readMessagesList = JSON.parse(readMessagesList);
        async.each(readMessagesList.Items, function (readMessage, callback) {
            deleteSingleReadMessageByReceiver(readMessage.message_id.S, function (err, data) {
                if (err) {
                    callback(err, null)
                } else {
                    callback(null, data)
                }
            })
        }, function (err, data) {
            if (err) {
                context.fail(messages.failed)
            } else {
                context.succeed(messages.succeed)
            }
        })
    })
}