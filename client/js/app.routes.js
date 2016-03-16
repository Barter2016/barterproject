'use strict';

angular.module('BarterApp').config(function($routeProvider) {
    
    $routeProvider
    
    .when('/Home', {
        templateUrl: 'templates/Home.html',
        controller: 'HomeCtrl'
    })
    
    // If none of the above...
    .otherwise('/Home');
   
});