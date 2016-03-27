angular.module('BarterApp').controller('MenuCtrl', ['$scope', 'UtilService', 'FacebookService', 'LocalStorageService', 'SessionService', '$window', 'AuthService', function($scope, UtilService, FacebookService, LocalStorageService, SessionService, $window, AuthFactory) {
    
    $scope.menu_items = {
        auth: [
            {"title": "Les annonces", "icon": "shopping_cart", "link": "/Home"}, 
            {"title": "Mon catalogue", "icon": "assignment", "link": "/Catalogue"},
            {"title": "Mes notifications", "icon": "notifications", "link": "/Notifications"},
            {"title": "Paramètres", "icon": "settings", "link": ""},
        ]
    }
    
    $scope.signInWithFacebook = FacebookService.login
    $scope.signInWithGoogle = AuthFactory.signInWithFacebook
    $scope.signOut = AuthFactory.signOut
    $scope.view = {title: "Les annonces"}

    const auth = AuthFactory.checkIfAuth()
    if(auth) {
        $scope.auth = auth.auth
        $scope.user = auth.user
    }
    
    $scope.go = function(path, title) {
        $scope.view.title = title
        UtilService.go(path)
    }

}]);