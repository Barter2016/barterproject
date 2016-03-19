angular.module('BarterApp').controller('NotificationsCtrl', ['$scope', '$mdDialog', '$mdMedia', 'GetService', 'UpdateService', 'LocalStorageService', function($scope, $mdDialog, $mdMedia, GetService, UpdateService, LocalStorageService) {

    $scope.project_name = "Barter Project"
    $scope.is_auth = false
    $scope.receiverEmail
    $scope.items

    /*
     * This function is called when a user email is entered and on click of the get notification button. 
     */
    $scope.scanNotificationsByReceiver = function() {
        console.log($scope.receiverEmail)
        if ($scope.receiverEmail) {
            getAllNotificationOfUser($scope.receiverEmail)
        }
    }

    /*
     * Update a notification of the user as read.
     *
     * param="_notification_id" The id of the notification to update.
     */
    $scope.updateNotificationAsRead = function(_notification_id) {
        console.log($scope.receiverEmail)
        if ($scope.receiverEmail) {
            UpdateService.updateNotificationAsRead(_notification_id, (err, data) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log(data)
                    getAllNotificationOfUser($scope.receiverEmail)
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
                console.log($scope.items)
                $scope.$apply()
            }
        })
    }

    $scope.showAdvanced = function(ev, _sender_email) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen
        
        LocalStorageService.set('sender_email', _sender_email)
        
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
    }
}])
