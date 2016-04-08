angular.module('BarterApp').factory('FileService', [function() {
    
    const fileService = {
        
        getBase64FromDataURI: (dataURI, callback) => {
            // If the file is not null.
            if(dataURI) {
                try {
                    if(dataURI.indexOf(';base64') > -1) {
                        console.log("in file service")
                        const indexOfData = dataURI.indexOf(',')
                        const base64String = dataURI.substring(indexOfData+1)
                        callback(null, base64String)
                    }
                    else {
                        callback(new Error("The provided URI is not a binary file."), null)
                    }
                }
                catch(err) {
                    callback(err, null)
                }
            }
            else {
                callback(new Error("The data URI is not defined."), null)
            }
        },
        
        /**
         * Convert a base64 string to a blob file.
         * 
         * params {base64String} the base64 string the convert.
         * params {blobType} represents the type of file to create.
         * params {callback} callback with a signature of: (err, blob)
         */ 
        base64ToBlob: (base64String, blobType, callback) => {
            try {
                const byteCharacters = atob(base64String)
                const byteNumbers = new Array(byteCharacters.length)
                
                for(var i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i)
                }
                
                const byteArray = new Uint8Array(byteNumbers)
                const blob = new Blob([byteArray], { type: blobType })
                callback(null, blob)
            }
            catch(err) {
                callback(err, null)
            }
        }
        
    }
    
    return fileService
}])