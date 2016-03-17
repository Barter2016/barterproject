'use strict';

angular.module('BarterApp').config(function($routeProvider) {
    
    $routeProvider
    
    .when('/SignIn', {
        templateUrl: 'templates/SignIn.html',
        controller: 'SignInCtrl'
    })
    
    .when('/SignUp', {
        templateUrl: 'templates/SignUp.html',
        controller: 'SignUpCtrl'
    })
    
    .when('/Home', {
        templateUrl: 'templates/Home.html',
        controller: 'HomeCtrl'
    })
    
    .otherwise('/Home');
   
});