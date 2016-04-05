angular.module('BarterApp').factory('ImageService', ['FileService', function(FileService) {

    const imageService = {

        compress: (image, callback) => {
            try {
                const canvasTemp = document.createElement('canvas')
                canvasTemp.width = image.naturalWidth
                canvasTemp.height = image.naturalHeight
                const contextTemp = canvasTemp.getContext("2d")
                    .drawImage(image, 0, 0)
                    
                const compressedImageURL = canvasTemp.toDataURL("image/jpeg", 0.5)
                FileService.getBase64FromDataURI(compressedImageURL, (err, base64String) => {
                    FileService.base64ToBlob(base64String, (err, "image/jpeg", (err, blob) => {
                        blob.name = image.name
                        callback(null, blob)
                    }))
                })
            }
            catch (err) {
                callback(err, null)
            }
        }
    }

    return imageService
}])