'use strict';

angular.module('BarterApp').config(function($routeProvider) {
    
    $routeProvider
    
    .when('/SignIn', {
        templateUrl: 'templates/SignIn.html',
        controller: 'SignInCtrl'
    })
    
    .when('/Home', {
        templateUrl: 'templates/Home.html',
        controller: 'HomeCtrl'
    })
    
    .otherwise('/Home');
   
});