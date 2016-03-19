angular.module('BarterApp').service('ProductService', ['CategoryService', function(CategoryService) {
    
    const self = this
    
    
    //*******************************************************
    // This function gets all the products from the database.
    // Input : A callback
    // Output : All the products
    //*******************************************************
    self.scanAllProducts = (callback) => {
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
    }
    
    
    /**
     * Retrieve the category object in the database with the category_id inside a product.
     * 
     * param-name="...products" arbitrary numbers of products
     */ 
    self.addCategoryToProducts = (...products) => {
        const productWithCategory = products.map((product) => {
            product.category = CategoryService.queryCategory(product.category_id, (category) => category)
        })
        return productWithCategory
    }
    
    
}])