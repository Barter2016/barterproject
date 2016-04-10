angular.module('BarterApp').controller('MenuCtrl', ['$scope', 'UtilService', 'LocalStorageService', 'SessionService', '$window', 'AuthService', '$mdSidenav', function($scope, UtilService, LocalStorageService, SessionService, $window, AuthService, $mdSidenav) {
    
    $scope.menu_items = {
        auth: [
            {"title": "Les annonces", "icon": "assignment", "link": "/Home"}, 
            {"title": "Mon catalogue", "icon": "import_contacts", "link": "/Catalogue"},
            {"title": "Mes notifications", "icon": "notifications", "link": "/Notifications"},
            {"title": "Mes offres", "icon": "local_offer", "link": "/Offers"},
            {"title": "Mes messages", "icon": "messages", "link": "/Messages"}
        ]
    }
    
    $scope.signInWithFacebook = AuthService.signInWithFacebook
    $scope.signInWithGoogle = AuthService.signInWithFacebook
    $scope.signOut = AuthService.signOut
    $scope.view = {title: " "}

    const auth = AuthService.checkIfAuth()
    if(auth) {
        $scope.auth = auth.auth
        $scope.user = auth.user
    }
    
    $scope.toggleMenu = function() {
        $mdSidenav('sidenav').toggle();
    }
    
    $scope.go = function(path, title) {
        $scope.view.title = title
        UtilService.go(path)
    }

}]);