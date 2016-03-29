angular.module('BarterApp').controller('SignUpCtrl', ['$scope', 'AuthService', function($scope, AuthService) {
    
    $scope.user = AuthService.getUser()
    
}]);