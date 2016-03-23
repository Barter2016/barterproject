angular.module('BarterApp').factory('ProductService', [function() {
    
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
                    callback(err, null)
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
         * not null it will checks the category too.
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
        }
        
    }
    
    return productService
}])