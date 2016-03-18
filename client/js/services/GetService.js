angular.module('BarterApp').service('GetService', function() {

    const self = this;

    //*******************************************************
    // This function gets all the products from the database.
    // Input : A callback
    // Output : All the products
    //*******************************************************
    self.scanAllProducts = function(callback) {
        AWS.config.credentials.get(function(err) {
            if (err) {
                callback(err, null);
            }
            else {
                const lambda = new AWS.Lambda({
                    region: 'us-west-2'
                });

                const lambda_params = {
                    FunctionName: 'scanAllProducts'
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
                            callback(null, payload.Items);
                        }
                    }
                });
            }
        });
    };

    //*********************************************************
    // This function gets all the categories from the database.
    // Input : A callback
    // Output : All the categories
    //*********************************************************
    self.scanAllCategories = function(callback) {
        AWS.config.credentials.get(function(err) {
            if (err) {
                callback(err, null);
            }
            else {
                const lambda = new AWS.Lambda({
                    region: 'us-west-2'
                });

                const lambda_params = {
                    FunctionName: 'scanAllCategories'
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
                            callback(null, payload.Items);
                        }
                    }
                });
            }
        });
    };

  
    self.scanNotificationsByReceiver = (_receiverEmail, callback) => {
        AWS.config.credentials.get((err) => {
            if (err) {
                callback(err, null);
            }
            else {
                const lambda = new AWS.Lambda({
                    region: 'us-west-2'
                });

                const lambda_params = {
                    FunctionName: 'scanNotificationsByReceiver',
                    Payload: JSON.stringify({
                        "receiver_email" : _receiverEmail
                    })
                };

                lambda.invoke(lambda_params, (error, response) => {
                    if (error) {
                        callback(error, null);
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
        });
    };

    /**
     * Query a category by id.
     * 
     * param-name="idToFind" is to id to query in the categories table.
     * param-name="callback(err, result)" is to function that will call after its execution.
     */
    self.queryCategory = (idToFind, callback) => {
        AWS.config.credentials.get((err) => {
            if(err) {
                callback(err, null)
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
                        callback(error, null);
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

});