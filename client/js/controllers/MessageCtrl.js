angular.module('BarterApp').controller('MessageCtrl', ['$scope', '$mdDialog', '$mdToast', '$mdMedia', 'MessageService', 'LocalStorageService', function($scope, $mdDialog, $mdToast, $mdMedia, MessageService, LocalStorageService) {
    $scope.data_loaded = false
    const currentUser = LocalStorageService.getObject('user')

    /*
     * This function is called the notifications page init.
     */
    $scope.init = function() {
        if (currentUser) {
            scanUnreadMessagesOfUser()
            scanReadMessagesOfUser()
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
                scanUnreadMessagesOfUser()
                $scope.$apply()
            }
        })
    }
    
    $scope.scanUnreadMessagesOfUser = function() {
        scanUnreadMessagesOfUser()
    }
    
    /*
     * Returns all the unread messages of the user.
     */
    function scanUnreadMessagesOfUser() {
        MessageService.scanUnreadMessagesOfUser(currentUser.email, (err, unreadMessages) => {
            if (err) {
                console.log(err)
            }
            else {
                $scope.unread_messages = unreadMessages
                $scope.data_loaded = true
                $scope.$apply()
            }
        })
    }
    
    $scope.scanReadMessagesOfUser = function() {
        scanReadMessagesOfUser()
    }
    
    /*
     * Returns all the read messages of the user.
     */
    function scanReadMessagesOfUser() {
        MessageService.scanReadMessagesOfUser(currentUser.email, (err, readMessages) => {
            if (err) {
                console.log(err)
            }
            else {
                $scope.read_messages = readMessages
                $scope.data_loaded = true
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
            scanUnreadMessagesOfUser()
        }, function() {
            scanUnreadMessagesOfUser()
        })
    }
    
    /*
     * Deletes all the read messages of a receiver from the database.
     *
     * param="user_email" The email of the user to delete the messages from.
     */
    $scope.deleteReadMessagesByReceiver = function() {
        MessageService.deleteReadMessagesByReceiver(currentUser.email, (err, data) => {
            if (err) {
                console.log(err)
            }
            else {
                scanReadMessagesOfUser()
                $scope.$apply()
            }
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
}])
