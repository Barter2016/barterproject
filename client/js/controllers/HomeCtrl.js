'use strict';

angular.module('BarterApp').controller('HomeCtrl', ['$scope', function($scope) {
    
    $scope.project_name = "Barter Project";
    $scope.is_auth = false;
    
    /*
    function lambdaTest() {
    
        AWS.config.credentials.get(function(err) {
            if (err) {
                console.log(err);
            } 
            else {
                var lambda = new AWS.Lambda({region: 'us-west-2'});
                
                var lambda_params = {
                    FunctionName: 'lambdaTestHandlerSam',
                    Payload: JSON.stringify({
                        val1: 'val1',
                        val2: 'val2'
                    })
                };
                
                lambda.invoke(lambda_params, function(error, response) {
                    if (error) {
                        console.log(error);
                    }   
                    else {
                        var payload = JSON.parse(response.Payload);
                        if (payload.errorMessage) {
                            console.log(payload.errorMessage);
                        }
                        else {
                            console.log(payload);
                        }
                    }
                });
            }
        });
        
    }
    */

    
}]);





