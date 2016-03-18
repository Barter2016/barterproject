angular.module('BarterApp').service('UpdateService', function() {
   
    const self = this;
    
    //**********************************************
    // This function updates a user in the database. 
    // Input : The updated user and a callback
    //**********************************************
    self.updateUser = function(updated_user, callback) {
        AWS.config.credentials.get(function(err) {
            if (err) {
                callback(err, null);
            } 
            else {
                const lambda = new AWS.Lambda({region: 'us-west-2'});
                
                const lambda_params = {
                    FunctionName: 'updateUser',
                    Payload: JSON.stringify({
                        updated_user: updated_user
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
    
    //*************************************************
    // This function updates a product in the database. 
    // Input : The updated product and a callback
    //*************************************************
    self.updateProduct = function(updated_product, callback) {
        AWS.config.credentials.get(function(err) {
            if (err) {
                callback(err, null);
            } 
            else {
                const lambda = new AWS.Lambda({region: 'us-west-2'});
                
                const lambda_params = {
                    FunctionName: 'updateProduct',
                    Payload: JSON.stringify({
                        updated_product: updated_product
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
    
    //**************************************************
    // This function updates a caterogy in the database. 
    // Input : The updated category and a callback
    //**************************************************
    self.updateCategory = function(updated_category, callback) {
        AWS.config.credentials.get(function(err) {
            if (err) {
                callback(err, null);
            } 
            else {
                const lambda = new AWS.Lambda({region: 'us-west-2'});
                
                const lambda_params = {
                    FunctionName: 'updateCategory',
                    Payload: JSON.stringify({
                        updated_category: updated_category
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
    // This function updates a product image in the database. 
    // Input : The updated product image and a callback
    //*******************************************************
    self.updateProductImage = function(updated_product_image, callback) {
        AWS.config.credentials.get(function(err) {
            if (err) {
                callback(err, null);
            } 
            else {
                const lambda = new AWS.Lambda({region: 'us-west-2'});
                
                const lambda_params = {
                    FunctionName: 'updateProductImage',
                    Payload: JSON.stringify({
                        updated_product_image: updated_product_image
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
    
    //******************************************************
    // This function updates a notification in the database. 
    // Input : The updated notification and a callback
    //******************************************************
    self.updateNotification = function(updated_notification, callback) {
        AWS.config.credentials.get(function(err) {
            if (err) {
                callback(err, null);
            } 
            else {
                const lambda = new AWS.Lambda({region: 'us-west-2'});
                
                const lambda_params = {
                    FunctionName: 'updateNotification',
                    Payload: JSON.stringify({
                        updated_notification: updated_notification
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
    
    self.updateNotificationAsRead = function(_notification_id, callback) {
        AWS.config.credentials.get(function(err) {
            if (err) {
                callback(err, null);
            } 
            else {
                const lambda = new AWS.Lambda({region: 'us-west-2'});
                
                const lambda_params = {
                    FunctionName: 'updateNotificationRead',
                    Payload: JSON.stringify({
                        notification_id: _notification_id
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