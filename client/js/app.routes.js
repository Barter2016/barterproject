angular.module('BarterApp').config(function($routeProvider) {
    
    $routeProvider
    
    .when('/', {
        templateUrl: 'templates/Home.html',
        controller: 'HomeCtrl'
    })
    
    .when('/SignUp', {
        templateUrl: 'templates/SignUp.html',
        controller: 'SignUpCtrl'
    })
    
    .when('/Home', {
        templateUrl: 'templates/Home.html',
        controller: 'HomeCtrl'
    })
    
    .when('/Catalogue', {
        templateUrl: 'templates/Catalogue.html',
        controller: 'CatalogueCtrl'
    })
    
    .when('/Notifications', {
        templateUrl: 'templates/Notification.html',
        controller: 'MessageCtrl'
    })
    
    .when('/Product/:id', {
        templateUrl: 'templates/Product.html',
        controller: 'ProductCtrl'
    })
    
    .when('/EditProduct/:id', {
        templateUrl: 'templates/EditProduct.html',
        controller: 'EditProductCtrl'
    })
    
    .when('/Offer', {
        templateUrl: 'templates/Offer.html',
        controller: 'OfferCtrl'
    })
    
    .when('/PageNotFound', {
        templateUrl: 'templates/404.html'
    })
    
    .otherwise('/PageNotFound');
   
});