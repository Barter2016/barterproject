angular.module('BarterApp').factory('FacebookService', ['SessionService', 'LocalStorageService', '$window', function(SessionService, LocalStorageService, $window) {
    
    var facebookService = {
        
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
        login : () => FB.login((response) => {
            if (response.status == "connected") {
                facebookService.getCurrentUserInfo(function(data) {
                    var credentials  = {
                        IdentityPoolId: 'us-east-1:0eb351fe-a9b6-4f00-ab1f-393802d750a5',
                        Logins: {
                            'graph.facebook.com': response.authResponse.accessToken
                        }
                    }
                    AWS.config.region = 'us-east-1'
                    AWS.config.credentials = new AWS.CognitoIdentityCredentials(credentials)
                    SessionService.create(credentials, null)
                    LocalStorageService.setObject('local_session', SessionService.get().user_credentials)
                    LocalStorageService.setObject('user', {email: data.email, name: data.name});
                    $window.location.reload()
                })
                
            }
        }, {scope: 'email,public_profile'}),

        /**
         * Get the the current public info of the user (if logged)
         * 
         * param-name="callback(userInfo)"
         * return the user informations.
         */
        getCurrentUserInfo : (callback) => FB.api('me?fields=email,name', (userInfo) => callback(userInfo))
    }
    
    return facebookService
}]);