angular.module('BarterApp').controller('NotificationsCtrl', ['$scope','GetService','UpdateService', function($scope, GetService, UpdateService) {
    
    $scope.project_name = "Barter Project"
    $scope.is_auth = false
    $scope.receiverEmail = ""
    
    $scope.scanNotificationsByReceiver = function () {
        console.log($scope.receiverEmail)
        if($scope.receiverEmail) {
            GetService.scanNotificationsByReceiver($scope.receiverEmail, (err, notifications) => {
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
                    $scope.$apply()
                }
            })
        }
    }
    

}]);





