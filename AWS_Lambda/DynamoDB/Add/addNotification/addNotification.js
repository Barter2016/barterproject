// Gloabal variables and dependencies
const md5 = require('md5');
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB({ region : 'us-west-2' });

/*
* This function adds a notification in the notifications table of the database.
*/
exports.addNotification = function (event, context) {
    
    const message = {
            succeed : "succeed",
            failed : "failed"
    };
        
    if (!event.sender_email || !event.receiver_email || !event.notification_message) {
        context.fail(message.failed);
    } else {
        const date = new Date();
        const notificationId = event.sender_email + date.getTime();
        const hashedNotificationId = md5(notificationId);
        
        const params = {
            "TableName": "notifications",
            "Item" : {
                "notification_id" : { "S" : hashedNotificationId },
                "sender_email" : { "S" : event.sender_email },
                "receiver_email" : { "S" : event.receiver_email },
                "notification_message" : { "S" : event.notification_message },
                "notification_read" : { "BOOL" : false }
            }
        };
        
        dynamoDB.putItem(params, function (err, data) {
            if (err) {
                context.fail(message.failed);
            } else {
                context.succeed(message.succeed);
            }
        });
    }
};