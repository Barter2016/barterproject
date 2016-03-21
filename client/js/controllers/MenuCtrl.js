angular.module('BarterApp').controller('MenuCtrl', ['$scope', 'UtilService', 'FacebookService', 'LocalStorageService', 'SessionService', '$window', 'AuthFactory', function($scope, UtilService, FacebookService, LocalStorageService, SessionService, $window, AuthFactory) {
    
    $scope.auth = checkIfAuth()

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
    $scope.signOut = signOut
    
    function checkIfAuth() {
        var local_session = LocalStorageService.getObject('local_session')
        var user = LocalStorageService.getObject('user')
        if (local_session && user) {
            $scope.user = user
            AWS.config.region = 'us-east-1'
            AWS.config.credentials = new AWS.CognitoIdentityCredentials(local_session)
        }
        return local_session
    }

    function signOut() {
        LocalStorageService.setObject('local_session', null)
        SessionService.destroy()
        $scope.go('/Home')
        $window.location.reload()
    }
    
}]);