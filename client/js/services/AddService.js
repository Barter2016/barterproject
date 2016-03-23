angular.module('BarterApp').service('AddService', function() {
    
    const self = this;
    
    //***********************************************
    // This function adds a new user in the database. 
    // Input : The new user and a callback
    //***********************************************
    self.addUser = function(new_user, callback) {
        AWS.config.credentials.get(function(err) {
            if (err) {
                callback(err, null);
            } 
            else {
                const lambda = new AWS.Lambda({region: 'us-west-2'});
                
                const Payload = {
                    email: new_user.email,
                    first_name: new_user.first_name,
                    last_name: new_user.last_name,
                    address: new_user.address,
                    auth_type: new_user.auth_type
                };
                
                const lambda_params = {
                    FunctionName: 'addUser',
                    Payload: JSON.stringify({
                        new_user: new_user
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
    self.addProduct = function(_new_product, callback) {
        AWS.config.credentials.get(function(err) {
            if (err) {
                callback(err, null);
            } 
            else {
                const lambda = new AWS.Lambda({region: 'us-west-2'});

                const payload = {
                        "user_email": _new_product.user_email,
                        "product_name": _new_product.product_name,
                        "product_description": _new_product.product_description,
                        "product_tags": _new_product.product_tags,
                        "category_id": _new_product.category_id
                }
                
                const lambda_params = {
                    FunctionName: 'addProduct',
                    Payload: JSON.stringify(payload)
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
    self.addCategory = function(new_category, callback) {
        AWS.config.credentials.get(function(err) {
            if (err) {
                callback(err, null);
            } 
            else {
                const lambda = new AWS.Lambda({region: 'us-west-2'});
                
                const lambda_params = {
                    FunctionName: 'addCategory',
                    Payload: JSON.stringify({
                        new_category: new_category
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
    self.addProductImage = function(new_product_image, callback) {
        AWS.config.credentials.get(function(err) {
            if (err) {
                callback(err, null);
            } 
            else {
                const lambda = new AWS.Lambda({region: 'us-west-2'});
                
                const lambda_params = {
                    FunctionName: 'addProduct_Image',
                    Payload: JSON.stringify({
                        new_product_image: new_product_image
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