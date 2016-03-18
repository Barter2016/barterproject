angular.module('BarterApp').config(function($routeProvider) {
    
    $routeProvider
    
    .when('/Home', {
        templateUrl: 'templates/Home.html',
        controller: 'HomeCtrl'
    })
    
    .when('/AddProduct', {
        templateUrl: 'templates/AddProduct.html',
        controller: 'AddProductCtrl'
    })
    
    .when('/Notifications', {
        templateUrl: 'templates/ViewNotifications.html',
        controller: 'NotificationsCtrl'
    })
    
    .otherwise('/Home');
   
});