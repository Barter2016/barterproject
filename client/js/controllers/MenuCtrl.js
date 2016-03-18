angular.module('BarterApp').controller('MenuCtrl', ['$scope', 'UtilService', function($scope, UtilService) {
    
    $scope.menu_items = [
        {"title": "Home", "icon": "home", "link": "/Home"}, 
        {"title": "My catalog", "icon": "assignment", "link": ""},
        {"title": "My notifications", "icon": "notifications", "link": "/Notifications"},
        {"title": "Settings", "icon": "settings", "link": ""},
        {"title": "Log out", "icon": "power_settings_new", "link": ""}
    ];
    
    $scope.user = {
        name: "User name",
        email: "User email"
    };
    
    $scope.go = UtilService.go;
    
}]);