angular.module('BarterApp').controller('MessageCtrl', ['$scope', '$mdDialog', '$mdToast', '$mdMedia', 'MessageService', 'LocalStorageService', function($scope, $mdDialog, $mdToast, $mdMedia, MessageService, LocalStorageService) {
    $scope.data_loaded = false
    const currentUser = LocalStorageService.getObject('user')
    
    /*
     * This function is called the notifications page init.
     */
    $scope.init = function() {
        if (currentUser) {
            getAllMessagesOfUser(currentUser.email)
        }
    }

    /*
     * Update a message as read.
     *
     * param="message_id" The id of the message to update.
     */
    $scope.updateMessageAsRead = function(message_id) {
        MessageService.updateMessageAsRead(message_id, (err, data) => {
            if (err) {
                console.log(err)
            }
            else {
                console.log(data)
                getAllMessagesOfUser(currentUser.email)
                $scope.$apply()
            }
        })
    }

    /*
     * Returns all the read and unread messages of a given user.
     *
     * param="message_receiver_email" The email of the current user to get the messages from.
     */
    function getAllMessagesOfUser(message_receiver_email) {
        MessageService.scanAllMessagesOfUser(message_receiver_email, (err, messages) => {
            if (err) {
                console.log(err)
            }
            else {
                $scope.messages = messages
                $scope.data_loaded = true
                $scope.$apply()
            }
        })
    }

    /*
     * Opens up a new window that allows the user to reply to an existing message in the list.
     *
     * param="ev" The event that the user did.
     * param="notification" The notification in JSON format the will be replied.
     */
    $scope.replyMessage = function(event, message) {
        LocalStorageService.set('currentMessage', JSON.stringify(message))

        $mdDialog.show({
                controller: ReplyMessageCtrl,
                templateUrl: 'templates/ReplyMessage.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                fullscreen: true
            })
            .then(function(answer) {
                getAllMessagesOfUser(currentUser.email)
            }, function() {
                getAllMessagesOfUser(currentUser.email)
            })
    }

    /*
     * Opens up a new window that allows the user to send a new message to another user.
     *
     * param="ev" The event that the user did.
     * param="user_email_of_product" The email of the user that has the product.
     */
    $scope.sendNewMessage = function (ev, user_email_of_product) {
        LocalStorageService.set('user_email_of_product', user_email_of_product);
        console.log(LocalStorageService.get('user_email_of_product'))
        $mdDialog.show({
            controller: SendNewMessageCtrl,
            templateUrl: 'templates/NewNotification.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: true
        })
        .then(function(answer) {
            getAllMessagesOfUser(currentUser.email)
        }, function() {
            getAllMessagesOfUser(currentUser.email)
        })
    }

    /*
     * The controller that has the behavior of replying to existing messages.
     *
     * param="$scope" Angularjs' $scope.
     * param="$mdDialog" Angular Material's $mdDialog.
     * param="LocalStorageService" The service that allows to store data in the local storage of the browser.
     */
    function ReplyMessageCtrl($scope, $mdDialog, LocalStorageService) {
        var currentMessage = LocalStorageService.get('currentMessage')
        currentMessage = JSON.parse(currentMessage)
        $scope.message = currentMessage.message_text.S
        $scope.message_sender_name = currentMessage.message_sender_name.S

        /*
         * This function hides the $mdDialog window without any actions.
         */
        $scope.hide = function() {
            $mdDialog.hide()
        }

        /*
         * This function cancels the $mdDialog window with all its proceses.
         */
        $scope.cancel = function() {
            $mdDialog.cancel()
        }

        /*
         * Creates a new notification in the database.
         */
        $scope.sendNewMessage = function() {
            const messageObj = {
                message_text: $scope.messageText,
                message_sender_email: currentUser.email,
                message_sender_name: currentUser.name,
                message_sender_picture: currentUser.picture.data.url,
                message_receiver_email: currentMessage.message_sender_email.S
            }
            MessageService.addMessage(messageObj, (err, newMessage) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log(newMessage);
                    updateMessageAsRead(currentMessage.message_id.S)
                    $mdDialog.hide()
                }
            })
        }

        /*
         * Update a notification of the user as read.
         *
         * param="_notification_id" The id of the notification to update.
         */
        function updateMessageAsRead(message_id) {
            MessageService.updateMessageAsRead(message_id, (err, data) => {
                if (err) {
                    console.log(err)
                }
                else {
                    getAllMessagesOfUser(currentUser.email)
                    $scope.$apply()
                }
            })
        }
    }

    /*
     * The controller that has the behavior of creating new notifications.
     *
     * param="$scope" Angularjs' $scope.
     * param="$mdDialog" Angular Material's $mdDialog.
     */
    function SendNewMessageCtrl($scope, $mdDialog) {
        const user = JSON.parse(LocalStorageService.get('user'))

        /*
         * This function hides the $mdDialog window without any actions.
         */
        $scope.hide = function() {
            $mdDialog.hide()
        }

        /*
         * This function cancels the $mdDialog window with all its proceses.
         */
        $scope.cancel = function() {
            $mdDialog.cancel()
        }

        /*
         * Creates a new notification in the database.
         */
        $scope.createNewMessage = function() {
            const newNotification = {
                notification_message: $scope.newMessage,
                user_email: user.email,
                user_name: user.name,
                user_picture: user.picture.data.url,
                receiver_email: LocalStorageService.get('user_email_of_product')
            }
            MessageService.notifyUser(newNotification, (err, newNotification) => {
                if (err) {
                    console.log(err)
                }
                else {
                    $scope.$apply()
                }
            })
        }
    }
}])
