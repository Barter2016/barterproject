'use strict';

angular.module('BarterApp').controller('HomeCtrl', ['$scope', function($scope) {
    
    $scope.message = "Message";
    
    testLambda();
    
    function testLambda() {
        
        AWS.config.credentials.get(function(err) {
           
            if (err) {
                console.log(err);
            }
            else {
                
                var lambda = new AWS.Lambda({region: 'us-west-2'});
                
                var params = {
                    FunctionName: 'lambdaTestHandlerSam',
                    Payload: JSON.stringify({
                        val1: "val1",
                        val2: "val2"
                    }) 
                };
                
                lambda.invoke(params, function(error, response) {
                    if (error) {
                        console.log(error);
                    } 
                    else {
                        var payload = JSON.parse(response.Payload);
                        if (payload.errorMessage) {
                            console.log(payload.errorMessage, null);
                        }
                        else {
                            console.log(null, payload);
                        }
                    }
                });
            }
        });
    }
    

    
}]);





