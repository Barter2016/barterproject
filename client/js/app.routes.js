angular.module('BarterApp').config(function($routeProvider) {
    
    $routeProvider
    
    .when('/Home', {
        templateUrl: 'templates/Home.html',
        controller: 'HomeCtrl',
        cache: true
    })
    
    .when('/Catalogue', {
        templateUrl: 'templates/Catalogue.html',
        controller: 'CatalogueCtrl',
        cache: true
    })
    
    .when('/Notifications', {
        templateUrl: 'templates/ViewNotifications.html',
        controller: 'NotificationsCtrl',
        cache: true
    })
    
    .otherwise('/Home');
   
});