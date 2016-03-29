angular.module('BarterApp').service('UtilService', ['$location', '$rootScope', function($location, $rootScope) {
    
    const self = this;
    
    //*************************
    // Changes the apps' route.
    // Input : The route to go
    //*************************
    self.go = function(path, doApply) {
        if(doApply) {
            $rootScope.$apply(function() {
                $location.path(path)
            })
        }
        else { 
            $location.path(path) 
        }
    }
    
    self.goApply = function(path) {
        $rootScope.$apply(function() {
            $location.path(path)
        })
    }
    
}]);