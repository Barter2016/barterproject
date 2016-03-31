angular.module('BarterApp').factory('OfferService', function() {
    
    const offerService = {
        addOffer: (sender, offer, targetProduct, callback) => {
            if(!sender) {
                callback(new Error("sender is undefined"), null)
                return
            }
            
            if(!offer
            || offer.length < 1) {
                callback(new Error("the offer has not been set"), null)
                return
            } 
            
            if(!targetProduct) {
                callback(new Error("The targeted product is not defined"), null)
                return
            }
            
            const lambda = new AWS.Lambda({region: 'us-west-2'})
    
            const payload = {
                "sender": sender,
                "targetedProduct": targetProduct,
                "productsOffered": offer
            }
                    
            const lambda_params = {
                FunctionName: 'addOffer',
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
        },
        
        /**
         * Find all the offer for a product.
         * 
         * param {productId} is the product to get the offers of.
         * param {callback} the function to call after the execution of the method.
         */ 
        findOfferByProduct: (productId, callback) => {
            // TODO implement this.
            return callback(null, null)
        }
    }
    
    return offerService
})