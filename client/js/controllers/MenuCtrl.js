angular.module('BarterApp').controller('MenuCtrl', ['$scope', 'UtilService', 'FacebookService', 'LocalStorageService', 'SessionService', '$window', 'AuthFactory', function($scope, UtilService, FacebookService, LocalStorageService, SessionService, $window, AuthFactory) {
    
    $scope.menu_items = {
        auth: [
            {"title": "Accueil", "icon": "home", "link": "/Home"}, 
            {"title": "Mon catalogue", "icon": "assignment", "link": "/Catalogue"},
            {"title": "Mes notifications", "icon": "notifications", "link": "/Notifications"},
            {"title": "Paramètres", "icon": "settings", "link": ""},
        ]
    }
    
    $scope.signInWithFacebook = FacebookService.login
    $scope.signInWithGoogle = AuthFactory.signInWithFacebook
    $scope.go = UtilService.go
    $scope.signOut = AuthFactory.signOut
    
    const auth = AuthFactory.checkIfAuth()
    if(auth) {
        $scope.auth = auth.auth
        $scope.user = auth.user
    }

}]);