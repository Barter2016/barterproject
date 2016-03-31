angular.module('BarterApp').factory('UserService', ['UtilService', 'SessionService', 'LocalStorageService', '$window', function(UtilService, SessionService, LocalStorageService, $window) {
    
    const userService = {
        addUser : (user, callback) => {
            
            if(!user.email) {
                callback(new Error('Undefined email.', null))
            }
            
            AWS.config.credentials.get((err) => {
                if (err) {
                    if (err.message.indexOf("Invalid login token") > -1) {
                        AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'us-east-1:0eb351fe-a9b6-4f00-ab1f-393802d750a5'})
                        AWS.config.credentials.clearCachedId()
                        LocalStorageService.setObject('local_session', null)
                        SessionService.destroy()
                        UtilService.go('/Home')
                        $window.location.reload()  
                    }
                    else {
                        callback(err, null)
                    }
                }
                else {
                    const lambda = new AWS.Lambda({
                        region: 'us-west-2'
                    });
                    
                    const lambda_params = {
                        FunctionName: 'addUser',
                        Payload: JSON.stringify({
                            email: user.email,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            address: user.address,
                            city: user.city,
                            country: user.country,
                            province: user.province,
                            postalcode: user.postalcode
                        })
                    };
    
                    lambda.invoke(lambda_params, (error, response) => {
                        if (error) {
                            callback(error, null)
                        }
                        else {
                            const payload = JSON.parse(response.Payload)
                            if (payload.errorMessage) {
                                callback(payload.errorMessage, null)
                            }
                            else {
                                callback(null, payload.Items)
                            }
                        }
                    })
                }
            })
        },
        
        queryUser: (email, callback) => {
            
            if(!email) {
                callback(new Error('Undefined email.', null))
            }
            
            AWS.config.credentials.get((err) => {
                if (err) {
                    if (err.message.indexOf("Invalid login token") > -1) {
                        AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'us-east-1:0eb351fe-a9b6-4f00-ab1f-393802d750a5'})
                        AWS.config.credentials.clearCachedId()
                        LocalStorageService.setObject('local_session', null)
                        SessionService.destroy()
                        UtilService.go('/Home')
                        $window.location.reload()  
                    }
                    else {
                        callback(err, null)
                    }
                }
                else {
                    const lambda = new AWS.Lambda({
                        region: 'us-west-2'
                    });
    
                    const lambda_params = {
                        FunctionName: 'queryUser',
                        Payload: JSON.stringify({
                            user_id: email
                        })
                    };
    
                    lambda.invoke(lambda_params, (error, response) => {
                         if (error) {
                            callback(error, null)
                        }
                        else {
                            const payload = JSON.parse(response.Payload)
                            if (payload.errorMessage) {
                                callback(payload.errorMessage, null)
                            }
                            else {
                                callback(null, payload.Items)
                            }
                        }
                    })
                }
            })
        }
    }
    
    return userService
}])