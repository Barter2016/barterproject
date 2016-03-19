angular.module('BarterApp').controller('MenuCtrl', ['$scope', 'UtilService', function($scope, UtilService) {
    
    $scope.menu_items = {
        auth: [
            {"title": "Home", "icon": "home", "link": "/Home"}, 
            {"title": "My catalog", "icon": "assignment", "link": ""},
            {"title": "My notifications", "icon": "notifications", "link": "/Notifications"},
            {"title": "Settings", "icon": "settings", "link": ""},
            {"title": "Log out", "icon": "power_settings_new", "link": ""},
        ],
        not_auth: [
            {"title": "Sign in with Facebook", "icon": "mdi mdi-facebook-box"},
            {"title": "Sign in with Google", "icon": "mdi mdi-google-plus-box"}
        ]
    };
    $scope.user = {
        name: "Sam-Pierre-Louis-Remi",
        email: "sam.pierre.louis.remi@gmail.com"
    };
    
    $scope.go = UtilService.go;
    
}]);