angular.module('BarterApp').config(function($routeProvider) {
    
    $routeProvider
    
    .when('/SignUp', {
        templateUrl: 'templates/SignUp.html',
        controller: 'SignUpCtrl'
    })
    
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
    
    .when('/Product/:id', {
        templateUrl: 'templates/Product.html',
        controller: 'ProductCtrl',
        cache: true
    })
    
    .when('/Offer/:id', {
        templateUrl: 'templates/Offer.html',
        controller: 'OfferCtrl',
        cache: true
    })
    
    .otherwise('/Home');
   
});