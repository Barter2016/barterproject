angular.module('BarterApp').factory('CategoryService', ['AuthService', function(AuthService) {
    
    return  {
        
        //*********************************************************
        // This function gets all the categories from the database.
        // Input : A callback
        // Output : All the categories
        //*********************************************************
        scanAllCategories : (callback) => {
            AWS.config.credentials.get((err) => {
                if (err) {
                    if (err.message.indexOf("Invalid login token") > -1) {
                        AuthService.signOut();
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
                        FunctionName: 'scanAllCategories'
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

        /**
         * Query a category by id.
         * 
         * param-name="idToFind" is to id to query in the categories table.
         * param-name="callback(err, result)" is to function that will call after its execution.
         */
        queryCategory : (idToFind, callback) => {
            AWS.config.credentials.get((err) => {
                if (err) {
                    if (err.message.indexOf("Invalid login token") > -1) {
                        AuthService.signOut();
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
                        FunctionName: 'queryCategory',
                        Payload: JSON.stringify({
                            category_id: idToFind
                        })
                    };
        
                    lambda.invoke(lambda_params, (error, response) => {
                        if (error) {
                            callback(error, null)
                        }
                        else {
                            const payload = JSON.parse(response.Payload);
                            if (payload.errorMessage) {
                                callback(payload.errorMessage, null);
                            }
                            else {
                                callback(null, payload.Items);
                            }
                        }
                    });
                }
            })
        }
    }
}])