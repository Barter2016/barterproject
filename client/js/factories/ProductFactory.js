angular.module('BarterApp').factory('ProductService', ['AuthService', function(AuthService) {
    
    const productService = {
    
        productsInCache : [],    //Store the last scan request result.
    
        /**
         * This function gets all the products from the database.
         * Input : A callback
         * Output : All the products
         */
        scanAllProducts : (callback) => {
            
            AWS.config.credentials.get(function(err) {
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
                    })
    
                    const lambda_params = {
                        FunctionName: 'scanAllProducts'
                    }
    
                    lambda.invoke(lambda_params, (error, response) => {
                        if (error) {
                            callback(error, null)
                        }
                        else {
                            // Parse from stringify to object
                            const payload = JSON.parse(response.Payload)
                            if (payload.errorMessage) {
                                callback(payload.errorMessage, null)
                            }
                            else {
                                productService.productsInCache = payload.Items  // Store the scan result in our cache.
                                callback(null, payload.Items)
                            }
                        }
                    })
                }
            })
        },
        
        /**
         * Search in the last scan if a the product name exists in our list. If the category is
         * not null it will check the category too.
         */ 
        searchProductByName : (productName, category, callback) => {
            var searchResult = []
            try {
                searchResult = productService.productsInCache.filter((product) => {
                    // If the product_name contains the searching name, then return true
                    return product.product_name.S.toLowerCase()
                    .indexOf(productName.toLowerCase()) > -1
                })
                
                // If the user has selected a category.
                if(category) {
                    // Filter by the selected category
                    searchResult = searchResult.filter((product) => { 
                        return product.category_name.S == category.category_name.S 
                    })
                }
                
                callback(null, searchResult)
            }
            catch(err) {
                callback(err, null)
            }
        },
        
        /**
         * Add a product in the database.
         * 
         * param {product} is the new product the add
         * param {callback} if an error has occured the callback will have the
         * signature of: (error, null), otherwise (null, productId)
         */ 
        addProduct : (product, callback) => {
            AWS.config.credentials.get(function(err) {
                if (err) {
                    if (err.message.indexOf("Invalid login token") > -1) {
                        AuthService.signOut();
                    }
                    else {
                        callback(err, null)
                    }
                } 
                else {
                    const lambda = new AWS.Lambda({region: 'us-west-2'})
    
                    const payload = {
                            "user_email": product.user_email,
                            "product_name": product.product_name,
                            "product_description": product.product_description,
                            "product_tags": product.product_tags,
                            "category_id": product.category_id
                    }
                    
                    const lambda_params = {
                        FunctionName: 'addProduct',
                        Payload: JSON.stringify(payload)
                    }
                    
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
                                callback(null, payload)
                            }
                        }
                    });
                }
            })
        },
        /**
         * updates a product in the database.
         * 
         * param {product} is the product to update
         * param {callback} if an error has occured the callback will have the
         * signature of: (error, null), otherwise (null, productId)
         */ 
        updateProduct : (product, callback) => {
            AWS.config.credentials.get(function(err) {
                if (err) {
                    if (err.message.indexOf("Invalid login token") > -1) {
                        AuthService.signOut();
                    }
                    else {
                        callback(err, null)
                    }
                } 
                else {
                    const lambda = new AWS.Lambda({region: 'us-west-2'})
    
                    const payload = {
                            "product_id": product.product_id,
                            "product_name": product.product_name,
                            "product_description": product.product_description,
                            "product_tags": product.product_tags,
                            "category_id": product.category_id,
                    }
                    
                    const lambda_params = {
                        FunctionName: 'updateProduct',
                        Payload: JSON.stringify(payload)
                    }
                    
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
                                callback(null, payload)
                            }
                        }
                    });
                }
            })
        }, 
        
        addImageToProduct : (productId, imageURL, callback) => {
            if(!productId){
                callback(new Error('Product ID can not be null'), null)
            }
            else if(!imageURL) {
                callback(new Error('Image URL can not be null'), null)
            }
            else {
                AWS.config.credentials.get(function(err) {
                    if (err) {
                    if (err.message.indexOf("Invalid login token") > -1) {
                            AuthService.signOut();
                        }
                        else {
                            callback(err, null)
                        }
                    }
                    else {
                        const lambda = new AWS.Lambda({region: 'us-west-2'})
        
                        const payload = {
                            "product_id": productId,
                            "image_url": imageURL
                        }
                        
                        const lambda_params = {
                            FunctionName: 'addImageToProduct',
                            Payload: JSON.stringify(payload)
                        }
                        
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
                                    callback(null, payload)
                                }
                            }
                        })
                    }
                })
            }
        },
        
        scanProductsByUser: (user_id, callback) => {
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
                    })
    
                    const lambda_params = {
                        FunctionName: 'scanProductsByUser',
                        Payload: JSON.stringify({
                            user_id: user_id
                        })
                    }
    
                    lambda.invoke(lambda_params, (error, response) => {
                        if (error) {
                            callback(error, null)
                        }
                        else {
                            const payload = JSON.parse(response.Payload);
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
        
        queryProduct: (id, callback) => {
            
            if(!id) {
                callback(new Error('Undefined product id.', null))
            }
            
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
                        FunctionName: 'queryProduct',
                        Payload: JSON.stringify({
                            product_id: id
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
    
    return productService
}])