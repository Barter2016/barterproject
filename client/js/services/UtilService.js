'use strict';

angular.module('BarterApp').service('UtilService', ['$location', function($location) {
    
    var self = this;
    
    //*************************
    // Changes the apps' route.
    // Input : The route to go
    //*************************
    self.go = function(path) {
        $location.path(path);
    };
    
}]);