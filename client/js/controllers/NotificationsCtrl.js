angular.module('BarterApp').controller('NotificationsCtrl', ['$scope', '$mdDialog', '$mdToast', '$mdMedia', 'NotificationService', 'LocalStorageService', function($scope, $mdDialog, $mdToast, $mdMedia, NotificationService, LocalStorageService) {
    $scope.project_name = "Barter Project"
    $scope.is_auth = false
    $scope.items
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

    $scope.showAdvanced = function(ev, notification) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen

        LocalStorageService.set('currentNotification', JSON.stringify(notification))

        $mdDialog.show({
                controller: SendMessageCtrl,
                templateUrl: 'templates/SendMessage.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            })
            .then(function(answer) {
                getAllNotificationOfUser(currentUser.email)
            }, function() {
                getAllNotificationOfUser(currentUser.email)
            })

        $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm')
        }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true)
        })
    }

    function SendMessageCtrl($scope, $mdDialog, LocalStorageService) {
        const user = JSON.parse(LocalStorageService.get('user'))
        var currentNotification = LocalStorageService.get('currentNotification')
        currentNotification = JSON.parse(currentNotification)
        $scope.message = currentNotification.notification_message.S
        $scope.sender_name = currentNotification.sender_name.S

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
                user_email: user.email,
                user_name: user.name,
                user_picture: user.picture.data.url,
                receiver_email: LocalStorageService.get('sender_email'),
                product_id: " "
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
}])
