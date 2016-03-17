'use strict';

angular.module('BarterApp').controller('SignInCtrl', ['$scope', function($scope) {
    
    $scope.signInWithFacebook = signInWithFacebook;
    
    
    function signInLocal() {
        
    }
    
    function signInWithGoogle() {
        
    }
    
    function signInWithFacebook() {
       FB.login(function(response) {
         if (response.status === 'connected') {
           console.log('user connected');
           console.log(response.authResponse.accessToken);
         } else if (response === 'not_authorized') {
           console.log('user not authorized');
         } else {
           console.log('user not logged in.');
         }
       });
     }
    
}]);