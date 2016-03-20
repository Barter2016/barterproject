angular.module('BarterApp').factory('ProductService', ['CategoryService', function(CategoryService) {
    
    const productService = {
    
        //*******************************************************
        // This function gets all the products from the database.
        // Input : A callback
        // Output : All the products
        //*******************************************************
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
         * Make an inner join like action on the product.category_id and the table categories.category_id
         * 
         * param-name="...products" arbitrary numbers of products
         */ 
        productsInnerJoinCategory : (...products) => {
            
            products.forEach((product) => console.log(product.product_name))
            
            const productJoinedToCategory = products.map((product) => {
                productService.addCategoryToProduct(product, (err, productWithCategory) => {
                    if(err) {
                        console.log(err)
                    }
                    else {
                        return productWithCategory
                    }
                })
            })
            
            return productJoinedToCategory
        },
        
        /**
         * Add a category attribute to a product object.
         * 
         * param-name="product" the object to add the category to.
         * param-name="callback" the function that will be callback after the execution.
         */
        addCategoryToProduct : (product, callback) => {
            if(product) {
                CategoryService.queryCategory(product.category_id.S, (err, category) => { 
                    if(err) {
                        callback(err, null)
                    }
                    else {
                        product.category = category
                        callback(null, category)
                    }
                })
            }
        }
    }
    
    return productService
}])