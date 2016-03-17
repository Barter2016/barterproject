'use strict';

angular.module('BarterApp').factory('FacebookFactory', ['$window', function($window) {
    
    var FacebookFactory = {
        
        getLoginStatus : function(callback) {
            FB.getLoginStatus(response);
        },
        me: function(callback){
            FB.api('/me', callback);
        }
        
    };

    return FacebookFactory; 
    
}]);