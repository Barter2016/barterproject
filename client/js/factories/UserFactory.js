angular.module('BarterApp').factory('UserService', function() {
    
    const userService = {
        addUser : (user, callback) => {
            
            if(!user.email) {
                callback(new Error('Undefined email.', null))
            }
            
            AWS.config.credentials.get((err) => {
                if (err) {
                    callback(err, null)
                }
                else {
                    const lambda = new AWS.Lambda({
                        region: 'us-west-2'
                    });
    
                    const lambda_params = {
                        FunctionName: 'addUser',
                        Payload: JSON.stringify({
                            user_id: user.email,
                            email: user.email,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            address: user.address,
                            auth_type: 'facebook'
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
                    callback(err, null)
                }
                else {
                    const lambda = new AWS.Lambda({
                        region: 'us-west-2'
                    });
    
                    const lambda_params = {
                        FunctionName: 'addUser',
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
})