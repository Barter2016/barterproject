angular.module('BarterApp').factory('AuthFactory', ['SessionService', 'LocalStorageService', 'GetService', '$window', 'FacebookService', function(SessionService, LocalStorageService, GetService, $window, FacebookService) {
    
    var AuthFactory = {
        
        signInWithFacebook: () => {
            
            FB.login((response) => {
                if (response.status == "connected") {
                    FacebookService.getCurrentUserInfo((data) => {
                        
                        GetService.queryUser(data.email, (err, data) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                if (data.length == 0) { // The user isnt signed up yet
                                    
                                }
                                else { // The user is signed up, so sign im in
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
                                    LocalStorageService.setObject('user', {email: data.email, name: data.name})
                                    $window.location.reload()
                                }
                            }
                        });
                        
                    })
                    
                }
            }, {scope: 'email,public_profile'})
                
        },
        
        signUpWithFacebook: () => {
            
        },
        
        signInWithGoogle: () => {
            
        },
        
        signUpWithGoogle: () => {
            
        },
        
        signOut: () => {
            
        }
        
    };
    
    return AuthFactory;
    
}]);