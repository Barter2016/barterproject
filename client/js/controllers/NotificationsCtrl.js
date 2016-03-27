angular.module('BarterApp').controller('NotificationsCtrl', ['$scope', '$mdDialog', '$mdToast', '$mdMedia', 'NotificationService', 'LocalStorageService', function($scope, $mdDialog, $mdToast, $mdMedia, NotificationService, LocalStorageService) {

    $scope.project_name = "Barter Project"
    $scope.is_auth = false
    $scope.items = []
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
                $scope.data_loaded = $scope.items.length > 0
                $scope.$apply()
            }
        })
    }

    $scope.showAdvanced = function(ev, notification) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen

        LocalStorageService.set('sender_email', notification.sender_email.S)
        LocalStorageService.set('notification_message', notification.notification_message.S)
        LocalStorageService.set('notification_id', notification.notification_id.S)

        $mdDialog.show({
                controller: SendMessageCtrl,
                templateUrl: 'templates/SendMessage.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".'
            }, function() {
                $scope.status = 'You cancelled the dialog.'
            })

        $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm')
        }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true)
        })
    }

    function SendMessageCtrl($scope, $mdDialog, LocalStorageService) {
        const currentUser = JSON.parse(LocalStorageService.get('user'))
        console.log(currentUser)
        const currentUserEmail = currentUser.email
        const currentNotificationId = LocalStorageService.get('notification_id')
        $scope.message = LocalStorageService.get('notification_message')
        $scope.sender_email = LocalStorageService.get('sender_email')

        $scope.hide = function() {
            $mdDialog.hide()
        }

        $scope.cancel = function() {
            $mdDialog.cancel()
        }

        $scope.answer = function(answer) {
            $mdDialog.hide(answer)
        }

        $scope.sendNotification = function() {
            const newNotification = {
                notification_message: $scope.notificationMessage,
                user_email: currentUserEmail,
                email_to_send: LocalStorageService.get('sender_email'),
                sender_image_url: ""
            }
            NotificationService.notifyUser(newNotification, (err, newNotification) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log(newNotification)
                    updateNotificationAsRead(currentNotificationId)
                }
            })
        }

        function updateNotificationAsRead(_notification_id) {
            NotificationService.updateNotificationAsRead(_notification_id, (err, data) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log(data)
                    getAllNotificationOfUser(currentUserEmail)
                    $mdDialog.hide()
                    $scope.$apply()
                }
            })
        }
    }
}])
