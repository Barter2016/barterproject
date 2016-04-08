angular.module('BarterApp').factory('ImageService', ['FileService', '$q', function(FileService, $q) {

    const imageService = {
        
        compressImages: (imagesWithName) => {
            const compressionCalls = []
            imagesWithName.forEach((imageWithName) => { 
                compressionCalls.push(imageService.asyncCompress(imageWithName.image, imageWithName.name)) 
            })
            return $q.all(compressionCalls)
        },
        
        /**
         * Compress an image an return an unnamed blob that contains
         * the image binary file in jpeg format.
         * 
         * params {image} the HTML Image object to compress.
         * params {callback} has the signature of callback(err, blob)
         */ 
        asyncCompress: (image, imageName) => {
            return $q((resolve, reject) => {
                try {
                    const canvasTemp = document.createElement('canvas')
                    canvasTemp.width = image.naturalWidth
                    canvasTemp.height = image.naturalHeight
                    const contextTemp = canvasTemp.getContext("2d")
                        .drawImage(image, 0, 0)
                        
                    const compressedImageURL = canvasTemp.toDataURL("image/jpeg", 0.5)
                    FileService.getBase64FromDataURI(compressedImageURL, (err, base64String) => {
                        if(err){
                            reject(err)
                        }
                        else {
                            FileService.base64ToBlob(base64String, "image/jpeg", (err, blob) => {
                                if(err) {
                                    reject(err)
                                }
                                else {
                                    blob.name = imageName
                                    resolve(blob)
                                }
                            })
                        }
                    })
                }
                catch (err) {
                    reject(err)
                }
            })
            
        }
    }

    return imageService
}])