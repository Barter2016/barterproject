angular.module('BarterApp').controller('NotificationsCtrl', ['$scope','GetService','UpdateService', function($scope, GetService, UpdateService) {
    
    $scope.project_name = "Barter Project"
    $scope.is_auth = false
    $scope.receiverEmail = ""
    $scope.items = ""
    
    $scope.scanNotificationsByReceiver = function () {
        console.log($scope.receiverEmail)
        if($scope.receiverEmail) {
            getAllNotificationOfUser($scope.receiverEmail)
        }
    }

    $scope.updateNotificationAsRead = function (_notification_id) {
        console.log($scope.receiverEmail)
        if($scope.receiverEmail) {
            UpdateService.updateNotificationAsRead(_notification_id, (err, data) => {
                if(err) {
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
    
    function getAllNotificationOfUser (receiver_email) {
        GetService.scanNotificationsByReceiver(receiver_email, (err, notifications) => {
            if(err) {
                console.log(err)
            }
            else {
                $scope.items = notifications
                console.log($scope.items)
                $scope.$apply()
            }
        })
    }
    

}]);





