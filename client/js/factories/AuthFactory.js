angular.module('BarterApp').factory('AuthService', ['SessionService', 
'LocalStorageService', 
'$window', 
'UtilService',
'UserService', function(SessionService, LocalStorageService, $window, UtilService, UserService) {
    
    var user
    var facebookResponse
    
    const AuthService = {
        
        setUser: (data) => {
            user = data
        },
        
        getUser: () => {
            return user
        },
        
        setFacebookResponse: (data) => {
            facebookResponse = data
        },
        
        getFacebookResponse: () => {
            return facebookResponse
        },
        
        signInWithFacebook : () => FB.login((response) => {
            if (response.status == "connected") {
                AuthService.getFacebookUserInfo(function(data) {
                    
                    UserService.queryUser(data.email, function(err, user) {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            if (user.length === 0) { // The user isn't in the database
                                
                                AuthService.setUser(data)
                                AuthService.setFacebookResponse(response)
                                UtilService.goApply('/SignUp', true)
                                
                            }
                            else { // The user is already signed up 
                                const credentials  = {
                                    IdentityPoolId: 'us-east-1:0eb351fe-a9b6-4f00-ab1f-393802d750a5',
                                    Logins: {
                                        'graph.facebook.com': response.authResponse.accessToken
                                    }
                                }
                                AWS.config.region = 'us-east-1'
                                AWS.config.credentials = new AWS.CognitoIdentityCredentials(credentials)
                                SessionService.create(credentials, null)
                                LocalStorageService.setObject('local_session', SessionService.get().user_credentials)
                                LocalStorageService.setObject('user', {email: data.email, name: data.name, picture : data.picture})
                                $window.location.reload()
                            }
                        }
                    })
                })
            }
        }, { scope: 'email,public_profile' }),
        
        getFacebookUserInfo : (callback) => FB.api('me?fields=email,name,picture', (userInfo) => callback(userInfo)),

        signUp: (new_user, callback) => {
            
            UserService.addUser(new_user, function(err, response) {
                
                if (err) {
                    callback(err)
                }
                else {
                    
                    const credentials  = {
                        IdentityPoolId: 'us-east-1:0eb351fe-a9b6-4f00-ab1f-393802d750a5',
                        Logins: {
                            'graph.facebook.com': AuthService.getFacebookResponse().authResponse.accessToken
                        }
                    }
                    AWS.config.region = 'us-east-1'
                    AWS.config.credentials = new AWS.CognitoIdentityCredentials(credentials)
                    SessionService.create(credentials, null)
                    LocalStorageService.setObject('local_session', SessionService.get().user_credentials)
                    const user = AuthService.getUser()
                    LocalStorageService.setObject('user', {email: user.email, name: user.name, picture : user.picture})
                    callback(null)
                }
                
            })
            
        },
        
        signInWithGoogle: () => {
            
        },
        
        signOut: () => {
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'us-east-1:0eb351fe-a9b6-4f00-ab1f-393802d750a5'})
            AWS.config.credentials.clearCachedId()
            LocalStorageService.setObject('local_session', null)
            SessionService.destroy()
            UtilService.go('/Home')
            $window.location.reload()  
        },
        
        checkIfAuth: () => {
            const local_session = LocalStorageService.getObject('local_session')
            const user = LocalStorageService.getObject('user')
            
            if (local_session) {
                AWS.config.region = 'us-east-1'
                AWS.config.credentials = new AWS.CognitoIdentityCredentials(local_session)
            } 
            
            const auth = {
                auth: local_session && user
            }
            
            if (auth.auth) {
                auth.user = user
                auth.local_session = local_session
            }
            
            return auth
        }
    
    }
    
    return AuthService
    
}])