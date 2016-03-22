angular.module('BarterApp').controller('NotificationsCtrl', ['$scope', '$mdDialog', '$mdToast', '$mdMedia', 'GetService', 'UpdateService', 'LocalStorageService', 'AddService', function($scope, $mdDialog, $mdToast, $mdMedia, GetService, UpdateService, LocalStorageService, AddService) {

    $scope.project_name = "Barter Project"
    $scope.is_auth = false
    $scope.items
    const currentUser = JSON.parse(LocalStorageService.get('user'))
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
            UpdateService.updateNotificationAsRead(_notification_id, (err, data) => {
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
    function getAllNotificationOfUser(receiver_email) {
        GetService.scanNotificationsByReceiver(receiver_email, (err, notifications) => {
            if (err) {
                console.log(err)
            }
            else {
                $scope.items = notifications
                LocalStorageService.set('userNotificatonNumber', notifications.length + 1); // Because a list starts by 0.
                console.log($scope.items)
                $scope.$apply()
            }
        })
    }

    $scope.showAdvanced = function(ev, _sender_email, _notification_id) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen

        LocalStorageService.set('sender_email', _sender_email)
        LocalStorageService.set('notification_id', _notification_id)

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
        const currentReceiverEmail = LocalStorageService.get('sender_email')
        const currentNotificationId = LocalStorageService.get('notification_id')
        $scope.sender_email = currentReceiverEmail

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
                current_user_email: currentUserEmail,
                user_email_send: currentReceiverEmail,
                sender_image_url: ""
            }
            AddService.addNotification(newNotification, (err, newNotification) => {
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
            UpdateService.updateNotificationAsRead(_notification_id, (err, data) => {
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
