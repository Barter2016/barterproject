angular.module('BarterApp').factory('MessageService', ['AuthService', function(AuthService) {

    const messageService = {

        notificationsInCache: [], //Store the last scan request result.

        /**
         * This function gets all the messages from the database by user emails.
         * Input : The email of the user to get the messages, A callback
         * Output : All the messages of a user
         */
        scanAllMessagesOfUser: (message_receiver_email, callback) => {

            AWS.config.credentials.get((err) => {
                if (err) {
                    if (err.message.indexOf("Invalid login token") > -1) {
                        AuthService.signOut();
                    }
                    else {
                        callback(err, null)
                    }
                }
                else {
                    const lambda = new AWS.Lambda({
                        region: 'us-west-2'
                    })
                    
                    const lambda_params = {
                        FunctionName: 'scanMessagesByReceiver',
                        Payload: JSON.stringify({
                            "message_receiver_email": message_receiver_email
                        })
                    }
                    
                    lambda.invoke(lambda_params, (error, response) => {
                        if (error) {
                            callback(error, null)
                        }
                        else {
                            const payload = JSON.parse(response.Payload)
                            if (payload.errorMessage) {
                                callback(payload.errorMessage, null)
                            }
                            else {
                                callback(null, payload.Items)
                            }
                        }
                    })
                }
            })
        },
        
        /**
         * This function gets all the messages from the database by user emails.
         * Input : The email of the user to get the messages, A callback
         * Output : All the messages of a user
         */
        scanMessagesBySender: (message_sender_email, callback) => {

            AWS.config.credentials.get((err) => {
                if (err) {
                    if (err.message.indexOf("Invalid login token") > -1) {
                        AuthService.signOut();
                    }
                    else {
                        callback(err, null)
                    }
                }
                else {
                    const lambda = new AWS.Lambda({
                        region: 'us-west-2'
                    })
                    
                    const lambda_params = {
                        FunctionName: 'scanMessagesBySender',
                        Payload: JSON.stringify({
                            "message_sender_email": message_sender_email
                        })
                    }
                    
                    lambda.invoke(lambda_params, (error, response) => {
                        if (error) {
                            callback(error, null)
                        }
                        else {
                            const payload = JSON.parse(response.Payload)
                            if (payload.errorMessage) {
                                callback(payload.errorMessage, null)
                            }
                            else {
                                callback(null, payload.Items)
                            }
                        }
                    })
                }
            })
        },
        
        /**
         * This function gets all the unread messages from the database by user emails.
         * Input : The email of the user to get the unread messages, A callback
         * Output : All the unread messages of a user
         */
        scanUnreadMessagesOfUser: (userEmail, callback) => {

            AWS.config.credentials.get((err) => {
                if (err) {
                    if (err.message.indexOf("Invalid login token") > -1) {
                        AuthService.signOut();
                    }
                    else {
                        callback(err, null)
                    }
                }
                else {
                    const lambda = new AWS.Lambda({
                        region: 'us-west-2'
                    });
                    const lambda_params = {
                        FunctionName: 'scanUnreadMessagesByReceiver',
                        Payload: JSON.stringify({
                            "message_receiver_email": userEmail
                        })
                    };
                    lambda.invoke(lambda_params, (error, response) => {
                        if (error) {
                            callback(error, null)
                        }
                        else {
                            const payload = JSON.parse(response.Payload)
                            if (payload.errorMessage) {
                                callback(payload.errorMessage, null)
                            }
                            else {
                                callback(null, payload.Items)
                            }
                        }
                    })
                }
            })
        },
        
        
        /**
         * This function gets all the read messages from the database by user emails.
         * Input : The email of the user to get the read messages, A callback
         * Output : All the read messages of a user
         */
        scanReadMessagesOfUser: (userEmail, callback) => {

            AWS.config.credentials.get((err) => {
                if (err) {
                    if (err.message.indexOf("Invalid login token") > -1) {
                        AuthService.signOut();
                    }
                    else {
                        callback(err, null)
                    }
                }
                else {
                    const lambda = new AWS.Lambda({
                        region: 'us-west-2'
                    })
                    
                    const lambda_params = {
                        FunctionName: 'scanReadMessagesByReceiver',
                        Payload: JSON.stringify({
                            "message_receiver_email": userEmail
                        })
                    }
                    
                    lambda.invoke(lambda_params, (error, response) => {
                        if (error) {
                            callback(error, null)
                        }
                        else {
                            const payload = JSON.parse(response.Payload)
                            if (payload.errorMessage) {
                                callback(payload.errorMessage, null)
                            }
                            else {
                                callback(null, payload.Items)
                            }
                        }
                    })
                }
            })
        },

        //*******************************************************
        // This function adds a new message in the database. 
        // Input : The new message and a callback
        //*******************************************************
        addMessage : (newMessage, callback) => {
            AWS.config.credentials.get((err) => {
                if (err) {
                    if (err.message.indexOf("Invalid login token") > -1) {
                        AuthService.signOut();
                    }
                    else {
                        callback(err, null)
                    }
                }
                else {
                    const lambda = new AWS.Lambda({
                        region: 'us-west-2'
                    })
                    
                    const lambda_params = {
                        FunctionName: 'addMessage',
                        Payload: JSON.stringify({
                            "message_sender_email": newMessage.message_sender_email,
                            "message_sender_name": newMessage.message_sender_name,
                            "message_sender_picture": newMessage.message_sender_picture,
                            "message_receiver_email": newMessage.message_receiver_email,
                            "message_text": newMessage.message_text
                        })
                    }
                    
                    lambda.invoke(lambda_params, function(error, response) {
                        if (error) {
                            callback(error, null)
                        }
                        else {
                            const payload = JSON.parse(response.Payload)
                            if (payload.errorMessage) {
                                callback(payload.errorMessage, null)
                            }
                            else {
                                callback(null, payload)
                            }
                        }
                    })
                }
            })
        },
        /**
         * This function updates a message from the database.
         * Input : The updated message, A callback
         */
        updateMessage : (updated_message, callback) => {
            AWS.config.credentials.get((err) => {
                if (err) {
                    if (err.message.indexOf("Invalid login token") > -1) {
                        AuthService.signOut();
                    }
                    else {
                        callback(err, null)
                    }
                }
                else {
                    const lambda = new AWS.Lambda({
                        region: 'us-west-2'
                    })

                    const lambda_params = {
                        FunctionName: 'updateNotification',
                        Payload: JSON.stringify({
                            updated_message: updated_message
                        })
                    }
                    
                    lambda.invoke(lambda_params, (error, response) => {
                        if (error) {
                            callback(error, null)
                        }
                        else {
                            const payload = JSON.parse(response.Payload)
                            if (payload.errorMessage) {
                                callback(payload.errorMessage, null)
                            }
                            else {
                                callback(null, payload)
                            }
                        }
                    })
                }
            })
        },
        
        /**
         * This function deletes all the read messages of a receiver from the database.
         * Input : The receiver email, A callback
         */
        deleteReadMessagesByReceiver : (message_receiver_email, callback) => {
            AWS.config.credentials.get((err) => {
                if (err) {
                    if (err.message.indexOf("Invalid login token") > -1) {
                        AuthService.signOut();
                    }
                    else {
                        callback(err, null)
                    }
                }
                else {
                    const lambda = new AWS.Lambda({
                        region: 'us-west-2'
                    })

                    const lambda_params = {
                        FunctionName: 'deleteReadMessagesByReceiver',
                        Payload: JSON.stringify({
                            message_receiver_email: message_receiver_email
                        })
                    }
                    
                    lambda.invoke(lambda_params, (error, response) => {
                        if (error) {
                            callback(error, null)
                        }
                        else {
                            const payload = JSON.parse(response.Payload)
                            if (payload.errorMessage) {
                                callback(payload.errorMessage, null)
                            }
                            else {
                                callback(null, payload)
                            }
                        }
                    })
                }
            });
        },
        
        /**
         * This function sets a message as read from the database.
         * Input : The id of the message, A callback
         */
        updateMessageAsRead: (message_id, callback) => {
            AWS.config.credentials.get((err) => {
                if (err) {
                    if (err.message.indexOf("Invalid login token") > -1) {
                        AuthService.signOut();
                    }
                    else {
                        callback(err, null)
                    }
                }
                else {
                    const lambda = new AWS.Lambda({
                        region: 'us-west-2'
                    })

                    const lambda_params = {
                        FunctionName: 'updateMessageAsRead',
                        Payload: JSON.stringify({
                            message_id: message_id
                        })
                    }
                    
                    lambda.invoke(lambda_params, (error, response) => {
                        if (error) {
                            callback(error, null)
                        }
                        else {
                            const payload = JSON.parse(response.Payload);
                            if (payload.errorMessage) {
                                callback(payload.errorMessage, null)
                            }
                            else {
                                callback(null, payload)
                            }
                        }
                    })
                }
            });
        }
    }
    return messageService
}])