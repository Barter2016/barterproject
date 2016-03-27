angular.module('BarterApp').factory('ImageService', [function() {
    
    const imageService = {
        
        encodeToBase64(file, callback) {
            // If the file is not null.
            if(file) {
                try {
                    console.log('in imageService')
                    const fileReader = new FileReader()
                    file.onloaded = callback(null, readerEvent)
                    fileReader.readAsBinaryString(file)
                }
                catch(err) {
                    callback(err, null)
                }
            }
        }
    }
    
    return imageService
}])