angular.module('BarterApp').service('DeleteService', function() {
    
     const self = this;
    
    //***********************************************
    // This function adds a new user in the database. 
    // Input : The new user and a callback
    //***********************************************
    self.deleteUser = function(user_id, callback) {
        AWS.config.credentials.get(function(err) {
            if (err) {
                callback(err, null);
            } 
            else {
                const lambda = new AWS.Lambda({region: 'us-west-2'});
                
                const lambda_params = {
                    FunctionName: 'deleteUser',
                    Payload: JSON.stringify({
                        user_id: user_id
                    })
                };
                
                lambda.invoke(lambda_params, function(error, response) {
                    if (error) {
                        callback(err, null);
                    }   
                    else {
                        const payload = JSON.parse(response.Payload);
                        if (payload.errorMessage) {
                            callback(payload.errorMessage, null);
                        }
                        else {
                            callback(null, payload);
                        }
                    }
                });
            }
        }); 
    };
    
    //**************************************************
    // This function adds a new product in the database. 
    // Input : The new product and a callback
    //**************************************************
    self.deleteProduct = function(product_id, callback) {
        AWS.config.credentials.get(function(err) {
            if (err) {
                callback(err, null);
            } 
            else {
                const lambda = new AWS.Lambda({region: 'us-west-2'});
                
                const lambda_params = {
                    FunctionName: 'deleteProduct',
                    Payload: JSON.stringify({
                        product_id: product_id
                    })
                };
                
                lambda.invoke(lambda_params, function(error, response) {
                    if (error) {
                        callback(error, null);
                    }   
                    else {
                        const payload = JSON.parse(response.Payload);
                        if (payload.errorMessage) {
                            callback(payload.errorMessage, null);
                        }
                        else {
                            callback(null, payload);
                        }
                    }
                });
            }
        }); 
    };
    
    //***************************************************
    // This function adds a new caterogy in the database. 
    // Input : The new category and a callback
    //***************************************************
    self.deleteCategory = function(category_id, callback) {
        AWS.config.credentials.get(function(err) {
            if (err) {
                callback(err, null);
            } 
            else {
                const lambda = new AWS.Lambda({region: 'us-west-2'});
                
                const lambda_params = {
                    FunctionName: 'deleteCategory',
                    Payload: JSON.stringify({
                        category_id: category_id
                    })
                };
                
                lambda.invoke(lambda_params, function(error, response) {
                    if (error) {
                        console.log(error);
                    }   
                    else {
                        const payload = JSON.parse(response.Payload);
                        if (payload.errorMessage) {
                            callback(payload.errorMessage, null);
                        }
                        else {
                            callback(null, payload);
                        }
                    }
                });
            }
        }); 
    };

    //********************************************************
    // This function adds a new product image in the database. 
    // Input : The new product image and a callback
    //********************************************************
    self.deleteProductImage = function(product_image_id, callback) {
        AWS.config.credentials.get(function(err) {
            if (err) {
                callback(err, null);
            } 
            else {
                const lambda = new AWS.Lambda({region: 'us-west-2'});
                
                const lambda_params = {
                    FunctionName: 'deleteProduct',
                    Payload: JSON.stringify({
                        product_image_id: product_image_id
                    })
                };
                
                lambda.invoke(lambda_params, function(error, response) {
                    if (error) {
                        callback(error, null);
                    }   
                    else {
                        const payload = JSON.parse(response.Payload);
                        if (payload.errorMessage) {
                            callback(payload.errorMessage, null);
                        }
                        else {
                            callback(null, payload);
                        }
                    }
                });
            }
        }); 
    };
    
    //*******************************************************
    // This function adds a new notification in the database. 
    // Input : The new notification and a callback
    //*******************************************************
    self.deleteNotification = function(notification_id, callback) {
        AWS.config.credentials.get(function(err) {
            if (err) {
                callback(err, null);
            } 
            else {
                const lambda = new AWS.Lambda({region: 'us-west-2'});
                
                const lambda_params = {
                    FunctionName: 'deleteProduct',
                    Payload: JSON.stringify({
                        notification_id: notification_id
                    })
                };
                
                lambda.invoke(lambda_params, function(error, response) {
                    if (error) {
                        callback(error, null);
                    }   
                    else {
                        const payload = JSON.parse(response.Payload);
                        if (payload.errorMessage) {
                            callback(payload.errorMessage, null);
                        }
                        else {
                            callback(null, payload);
                        }
                    }
                });
            }
        }); 
    };
    
});