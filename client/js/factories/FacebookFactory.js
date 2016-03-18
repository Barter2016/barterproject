angular.module('BarterApp').factory('FacebookService', ['SessionService', 'LocalStorageService', function(SessionService, LocalStorageService) {
    
    return {
        
        /**
         * Get the login status of the current user.
         * 
         * return the status the the login state.
         */ 
        getLoginStatus : (callback) => FB.getLoginStatus((response) => callback(response.status)),
        
        /**
         * Log a user with the facebook API.
         * 
         * return status of the login state.
         */ 
        login : (callback) => FB.login((response) => {
            if (response.authResponse) {
                console.log(response);
            
                AWS.config.region = 'us-east-1';
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: 'us-east-1:0eb351fe-a9b6-4f00-ab1f-393802d750a5',
                    Logins: {
                        'graph.facebook.com': response.authResponse.accessToken
                    }
                });
            }
            
            callback(response.status);
        }),
        
        /**
         * Get the the current public info of the user (if logged)
         * 
         * return the user informations.
         */
        getCurrentUserInfo : (callback) => FB.api('/me', (userInfo) => callback(userInfo))
    }
    
}]);