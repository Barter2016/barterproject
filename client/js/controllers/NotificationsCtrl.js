angular.module('BarterApp').controller('NotificationsCtrl', ['$scope', '$mdDialog', '$mdToast', '$mdMedia', 'NotificationService', 'LocalStorageService', function($scope, $mdDialog, $mdToast, $mdMedia, NotificationService, LocalStorageService) {
    $scope.data_loaded = false
    const currentUser = LocalStorageService.getObject('user')
    const currentUserEmail = currentUser.email
        /*
         * This function is called the notifications page init.
         */
    $scope.init = function() {
        if (currentUser) {
            getAllNotificationOfUser(currentUserEmail)
        }
    }

    /*
     * Update a notification of the user as read.
     *
     * param="_notification_id" The id of the notification to update.
     */
    $scope.updateNotificationAsRead = function(_notification_id) {
        if (currentUserEmail) {
            NotificationService.updateNotificationAsRead(_notification_id, (err, data) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log(data)
                    getAllNotificationOfUser(currentUserEmail)
                    $scope.$apply()
                }
            })
        }
    }

    /*
     * Returns all the read and unread notifications of a given user.
     *
     * param="receiver_email" The email of the current user to get the notification from.
     */
    function getAllNotificationOfUser(user_email) {
        NotificationService.scanAllNotificationsOfUser(user_email, (err, notifications) => {
            if (err) {
                console.log(err)
            }
            else {
                $scope.items = notifications
                $scope.data_loaded = $scope.items
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
    $scope.replyToMessage = function(ev, notification) {
        LocalStorageService.set('currentNotification', JSON.stringify(notification))

        $mdDialog.show({
                controller: SendReplyMessageCtrl,
                templateUrl: 'templates/ReplyNotification.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: true
            })
            .then(function(answer) {
                getAllNotificationOfUser(currentUser.email)
            }, function() {
                getAllNotificationOfUser(currentUser.email)
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
                getAllNotificationOfUser(currentUser.email)
            }, function() {
                getAllNotificationOfUser(currentUser.email)
            })
    }

    /*
     * The controller that has the behavior of replying to existing notifications.
     *
     * param="$scope" Angularjs' $scope.
     * param="$mdDialog" Angular Material's $mdDialog.
     * param="LocalStorageService" The service that allows to store data in the local storage of the browser.
     */
    function SendReplyMessageCtrl($scope, $mdDialog, LocalStorageService) {
        const user = JSON.parse(LocalStorageService.get('user'))
        var currentNotification = LocalStorageService.get('currentNotification')
        currentNotification = JSON.parse(currentNotification)
        $scope.message = currentNotification.notification_message.S
        $scope.sender_name = currentNotification.sender_name.S

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
        $scope.sendNotification = function() {
            const newNotification = {
                notification_message: $scope.notificationMessage,
                user_email: user.email,
                user_name: user.name,
                user_picture: user.picture.data.url,
                receiver_email: LocalStorageService.get('sender_email')
            }
            NotificationService.notifyUser(newNotification, (err, newNotification) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log(newNotification)
                    $mdDialog.hide("Message envoyé")
                    updateNotificationAsRead(currentNotification.notification_id.S)
                }
            })
        }

        /*
         * Update a notification of the user as read.
         *
         * param="_notification_id" The id of the notification to update.
         */
        function updateNotificationAsRead(_notification_id) {
            NotificationService.updateNotificationAsRead(_notification_id, (err, data) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log(data)
                    getAllNotificationOfUser(currentUserEmail)
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
            NotificationService.notifyUser(newNotification, (err, newNotification) => {
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
