angular.module('BarterApp').factory('OfferService', function() {
    
    const offerService = {
        /**
         * Add an offer for a product.
         * 
         * param {sender} the email of the user who makes an offer.
         * param {offer} is an array of string representing different product IDs the user want to offer.
         * param {targetedProduct} is the product the user want.
         * param {callback} callback the function after this method has finish.
         */ 
        addOffer: (sender, receiver, offer, targetedProduct, callback) => {
            if(!sender) {
                callback(new Error("sender is undefined"), null)
                return
            }
            
            if(!offer
            || offer.length < 1) {
                callback(new Error("the offer has not been set"), null)
                return
            } 
            
            if(!targetedProduct) {
                callback(new Error("The targeted product is not defined"), null)
                return
            }
            
            const lambda = new AWS.Lambda({region: 'us-west-2'})
    
            const payload = {
                "sender": sender.email,
                "sender_name": sender.name,
                "sender_picture": sender.picture,
                "receiver": receiver,
                "targetedProduct": targetedProduct,
                "productsOffered": offer
            }
                    
            const lambda_params = {
                FunctionName: 'addOffer',
                Payload: JSON.stringify(payload)
            }
            
            console.log(lambda_params.Payload)
            
            lambda.invoke(lambda_params, (err, response) => {
                if (err) {
                    console.log('test1')
                    callback(err, null)
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
         * param {productId} is the product ID to get the offers of.
         * param {callback} the function to call after the execution of the method.
         */ 
        scanOfferByProduct: (productId, callback) => {
            if(!productId) {
                callback(new Error("product can not be null."))
            }
            else {
                const lambda = new AWS.Lambda({region: 'us-west-2'})
    
                const payload = {
                    "product_id": productId
                }
                        
                const lambda_params = {
                    FunctionName: 'scanOfferByProduct',
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
                            
                            // This lambda only return one result.
                            callback(null, payload.Items[0])
                        }
                    }
                });
            }
        },
        
        /**
         * Find all the offers for a receiver.
         * 
         * param {receiver} is the email of the receiver to get the offers from.
         * param {callback} the function to call after the execution of the method.
         */ 
        scanOffersByReceiver: (receiver, callback) => {
            if(!receiver) {
                callback(new Error("receiver can not be null."))
            }
            else {
                const lambda = new AWS.Lambda({region: 'us-west-2'})
    
                const payload = {
                    "receiver": receiver
                }
                        
                const lambda_params = {
                    FunctionName: 'scanOffersByReceiver',
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
                            callback(null, payload.Items)
                        }
                    }
                });
            }
        },
        
        /**
         * Find all the offers for a sender.
         * 
         * param {sender} is the email of the sender to get the offers from.
         * param {callback} the function to call after the execution of the method.
         */ 
        scanOffersBySender: (sender, callback) => {
            if(!sender) {
                callback(new Error("sender can not be null."))
            }
            else {
                const lambda = new AWS.Lambda({region: 'us-west-2'})
    
                const payload = {
                    "sender": sender
                }
                        
                const lambda_params = {
                    FunctionName: 'scanOffersBySender',
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
                            callback(null, payload.Items)
                        }
                    }
                });
            }
        },
        
        /**
         * Query an offer by ID.
         * 
         * param {offerID} the ID of the offer to query.
         * param {callback} the function to call after the execution or on an error.
         */ 
        queryOffer: (offerId, callback) => {
            if(!offerId) {
                callback("The offer ID can not be null.")
            }
            
            else {
                const lambda = new AWS.Lambda({region: 'us-west-2'})
    
                const payload = {
                    "offer_id": offerId
                }
                        
                const lambda_params = {
                    FunctionName: 'queryOffer',
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
        }
    }
    
    return offerService
})