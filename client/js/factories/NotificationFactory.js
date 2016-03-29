angular.module('BarterApp').factory('NotificationService', [function() {

    const notificationService = {

        notificationsInCache: [], //Store the last scan request result.

        /**
         * This function gets all the notifications from the database by user emails.
         * Input : The email of the user to get the notifications, A callback
         * Output : All the notifications of a user
         */
        scanAllNotificationsOfUser: (user_email, callback) => {

            AWS.config.credentials.get((err) => {
                if (err) {
                    callback(err, null);
                }
                else {
                    const lambda = new AWS.Lambda({
                        region: 'us-west-2'
                    });

                    const lambda_params = {
                        FunctionName: 'scanNotificationsByReceiver',
                        Payload: JSON.stringify({
                            "receiver_email": user_email
                        })
                    };

                    lambda.invoke(lambda_params, (error, response) => {
                        if (error) {
                            callback(error, null);
                        }
                        else {
                            const payload = JSON.parse(response.Payload);
                            if (payload.errorMessage) {
                                callback(payload.errorMessage, null);
                            }
                            else {
                                callback(null, payload.Items);
                            }
                        }
                    });
                }
            });
        },

        //*******************************************************
        // This function adds a new notification in the database. 
        // Input : The new notification and a callback
        //*******************************************************
        notifyUser: (new_notification, callback) => {
            AWS.config.credentials.get(function(err) {
                if (err) {
                    callback(err, null);
                }
                else {
                    const lambda = new AWS.Lambda({
                        region: 'us-west-2'
                    });
                    const lambda_params = {
                        FunctionName: 'addNotification',
                        Payload: JSON.stringify({
                            "sender_email": new_notification.user_email,
                            "sender_name": new_notification.user_name,
                            "sender_picture": new_notification.user_picture,
                            "receiver_email": new_notification.receiver_email,
                            "product_id": new_notification.product_id,
                            "notification_message": new_notification.notification_message
                        })
                    };
                    lambda.invoke(lambda_params, function(error, response) {
                        if (error) {
                            callback(error, null);
                        }
                        else {
                            const payload = JSON.parse(response.Payload);
                            if (payload.errorMessage) {
                                callback(payload.errorMessage, null);
                            }
                            else {
                                callback(null, payload);
                            }
                        }
                    });
                }
            });
        },
        /**
         * This function updates a notification from the database.
         * Input : The updated notification, A callback
         */
        updateNotification: (updated_notification, callback) => {
            AWS.config.credentials.get(function(err) {
                if (err) {
                    callback(err, null);
                }
                else {
                    const lambda = new AWS.Lambda({
                        region: 'us-west-2'
                    });

                    const lambda_params = {
                        FunctionName: 'updateNotification',
                        Payload: JSON.stringify({
                            updated_notification: updated_notification
                        })
                    };
                    lambda.invoke(lambda_params, function(error, response) {
                        if (error) {
                            callback(error, null);
                        }
                        else {
                            const payload = JSON.parse(response.Payload);
                            if (payload.errorMessage) {
                                callback(payload.errorMessage, null);
                            }
                            else {
                                callback(null, payload);
                            }
                        }
                    });
                }
            });
        },
        /**
         * This function sets a notification as read from the database.
         * Input : The id of the notification, A callback
         */
        updateNotificationAsRead: (_notification_id, callback) => {
            AWS.config.credentials.get(function(err) {
                if (err) {
                    callback(err, null);
                }
                else {
                    const lambda = new AWS.Lambda({
                        region: 'us-west-2'
                    });

                    const lambda_params = {
                        FunctionName: 'updateNotificationRead',
                        Payload: JSON.stringify({
                            notification_id: _notification_id
                        })
                    };
                    lambda.invoke(lambda_params, function(error, response) {
                        if (error) {
                            callback(error, null);
                        }
                        else {
                            const payload = JSON.parse(response.Payload);
                            if (payload.errorMessage) {
                                callback(payload.errorMessage, null);
                            }
                            else {
                                callback(null, payload);
                            }
                        }
                    });
                }
            });
        }
    }
    return notificationService
}])