// Gloabal variables and dependencies
const md5 = require('md5');
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB({ region : 'us-west-2' });
const monthNames = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
];

const date = new Date();
const day = date.getDate();
const monthIndex = date.getMonth();
const year = date.getFullYear();

/*
* This function adds a notification in the notifications table of the database.
*/
exports.addNotification = function (event, context) {
    
    const message = {
            succeed : "succeed",
            failed : "failed"
    };
        
    if (!event.sender_picture || !event.sender_name || !event.sender_email || !event.receiver_email || !event.notification_message) {
        context.fail(message.failed);
    } else {
        const date = new Date();
        const notificationId = event.sender_email + date.getTime();
        const hashedNotificationId = md5(notificationId);
        const notification_date = monthNames[monthIndex] + " " + day + " " + year;
        const params = {
            "TableName": "notifications",
            "Item" : {
                "notification_id" : { "S" : hashedNotificationId },
                "sender_email" : { "S" : event.sender_email },
                "sender_name" : { "S" : event.sender_name },
                "sender_picture" : { "S" : event.sender_picture },
                "receiver_email" : { "S" : event.receiver_email },
                "notification_message" : { "S" : event.notification_message },
                "notification_date" : { "S" : notification_date },
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