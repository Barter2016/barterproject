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
* This function adds a message in the messages table of the database.
*/
exports.addMessage = function (event, context) {
    
    const message = {
            succeed : "succeed",
            failed : "failed"
    };
        
    if (!event.message_sender_email || !event.message_sender_name || !event.message_sender_picture || !event.message_receiver_email || !event.message_text) {
        context.fail(message.failed);
    } else {
        const date = new Date();
        const message_id = event.message_sender_email + date.getTime();
        const hashedMessageId = md5(message_id);
        const message_date = day + " " + monthNames[monthIndex] + " " + year;
        const params = {
            "TableName": "messages",
            "Item" : {
                "message_id" : { "S" : hashedMessageId },
                "message_sender_email" : { "S" : event.message_sender_email },
                "message_sender_name" : { "S" : event.message_sender_name },
                "message_sender_picture" : { "S" : event.message_sender_picture },
                "message_receiver_email" : { "S" : event.message_receiver_email },
                "message_text" : { "S" : event.message_text },
                "message_date" : { "S" : message_date },
                "message_read" : { "BOOL" : false }
            }
        };
        
        dynamoDB.putItem(params, function (err, data) {
            if (err) {
                context.fail(err);
            } else {
                context.succeed(message.succeed);
            }
        });
    }
};