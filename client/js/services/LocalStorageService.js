angular.module('BarterApp').service('LocalStorageService', ['$window', function($window) {
    
    const self = this;
    
    //*************************************
    // Sets a value in the local storage.
    // Input : The key and the value to set
    //*************************************
    self.set = function(key, value) {
        $window.localStorage[key] = value;
    };
  
    //*************************************
    // Gets a value from the local storage.
    // Input : The key
    // Ouput : The value
    //*************************************
    self.get = function(key) {
        return $window.localStorage[key] || null;
    };
    
    //*************************************
    // Sets an object in the local storage.
    // Input : The key and the value to set
    //*************************************
    self.setObject = function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
    };
    
    //***************************************
    // Gets an object from the local storage.
    // Input : The key
    // Output : The value
    //***************************************
    self.getObject = function(key) {
        const object = $window.localStorage[key];
        return (object) ? JSON.parse(object) : null;  
    };
    
}]);