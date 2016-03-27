angular.module('BarterApp').factory('BucketService', function() {
    
    const bucketName = 'barter-project-bucket'
    
    const bucketService = {
        
        /**
         * Upload a file to the main bucket.
         */
        uploadFile : (obj, callback) => {
            if(obj) {
                const s3 = new AWS.S3({ params: { Bucket: bucketName } })
                
                const splitedName = obj.name.split('.') 
                
                const fileExtension = splitedName[1]
                
                const keyName  = splitedName[0] 
                    + new Date().getTime() 
                    + '.' 
                    + fileExtension
                    
                // Here we're renamming the file to be the name of the file + the current time in milliseconds.
                const params = {
                    Key: keyName,
                    Body: obj   
                }
                
                s3.upload(params, (err, data) => {
                    if(err) {
                        callback(err, null)
                    }
                    else {
                        callback(null, data)
                    }
                })
            }
            else {
                callback(new Error('Undefined parameter'), null)
            }
        },
        
        /**
         * Retrieve a file from a bucket.
         */ 
        retrieveFile : (fileName, callback) => {
            if(fileName) {
                callback(new Error('The file name can not be null.'))
            }
            else {
                const s3 = new AWS.S3()
                const params = {
                    Bucket: bucketName,
                    Key: fileName
                }
                s3.getObject(params, (err, data) => {
                    if(err) {
                        callback(err, null)
                    }
                    else {
                        callback(null, data)
                    }
                })
            }
            
        }
        
    }
    return bucketService
})