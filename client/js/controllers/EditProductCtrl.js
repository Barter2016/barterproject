angular.module('BarterApp').controller('EditProductCtrl', ['$scope','$routeParams','ProductService','CategoryService','AuthService','LocalStorageService','BucketService',function($scope, $routeParams, ProductService,CategoryService,AuthService,LocalStorageService,BucketService) {
    
    const product_id = $routeParams.id
    const user = LocalStorageService.getObject('user')
    $scope.currentImgIndex = 0;
    $scope.existingImages = [];
    CategoryService.scanAllCategories((err, categories) => {
        if (err) {
            console.log(err)
        }
        else {
            $scope.categories = categories
            $scope.data_loaded = $scope.categories && $scope.new_product
            $scope.$apply()
            
        }
    })
    
    ProductService.queryProduct(product_id,(err, product) => {
        if (err) {
            console.log(err)
        }
        else {
            $scope.new_product = product;
            $scope.new_product.product_name = product.product_name.S
            $scope.new_product.product_description = product.product_description.S
            $scope.new_product.category_id = product.category_id.S
            //create images object to show current product images
            $scope.new_product.image_urls.SS.forEach(img =>{
                createImageFromDatabase(img)
            })
            //display current product images
            $scope.imagesToPreview = $scope.existingImages
            
            $scope.data_loaded = $scope.categories && $scope.new_product
            $scope.$apply()
        }
    })
    
    $scope.editProduct = (new_product) => {
        var addedImages = false;
        if(AuthService.checkIfAuth()) {
        
            //hardcoder les tags pour l'instants
            new_product.product_tags = "product"
            new_product.product_id = product_id
            new_product.user_email = user.email
            new_product.image_urls = $scope.new_product.image_urls.SS
            console.log(new_product)
        
            ProductService.updateProduct(new_product, (err, productId) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log(productId)
                    alertify.success("Le produit " + new_product.product_name + " a été modifié avec succès")
    
                    const file = document.getElementById('imageFile').files[0]
                    
                    BucketService.uploadFile(file, (err, data) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            
                            ProductService.addImageToProduct(productId, data.Location, (err, data) => {
                                if (err) {
                                    console.log(err)
                                }
                            })
                        }
                    })
                }
            })
        }
    }
    //sets current index
    $scope.setCurrentImgIndex = (index) => {
        $scope.currentImgIndex = index;
    };
    //checks if selected index is current index
    $scope.isCurrentImgIndex = (index) => {
        return $scope.currentImgIndex === index;
    };
    
 
    
    //function to show previous image in the preview box
    $scope.showPreviousImg = () => {
        $scope.currentImgIndex = ($scope.currentImgIndex > 0) ? --$scope.currentImgIndex : $scope.imagesToPreview.length - 1;
    };
    //function to show next image in the preview box
    $scope.showNextImg = () => {
        $scope.currentImgIndex = ($scope.currentImgIndex < $scope.imagesToPreview.length - 1) ? ++$scope.currentImgIndex : 0;
        
        //console.log($scope.currentImgIndex)
    };
    //function that removes an image from the image_urls array
    //once the user clicks on "modify product", the product will not be associated with those images anymore
    $scope.removeImageFromProduct = () => {
        $scope.new_product.image_urls.SS.splice($scope.currentImgIndex, 1);
        //corrects the index to display last ok image
        if($scope.currentImgIndex != 1)
            $scope.currentImgIndex --;
        console.log($scope.new_product);
    }
    
    //called when image input is changed
    $scope.fileChanged = () => {
        // document.getElement return an HTMLCollection, therefore you must convert it to an array.
        const filesHTMLCollection = document.getElementById('imageFile').files
        
        // HTMLColllection to array.
        const filesArray = [].slice.call(filesHTMLCollection)
        
        if(filesArray.length > 0) {
            $scope.imagesToPreview = $scope.existingImages //we reset the images array to only the images already associated with the product
            const numberOfFiles = filesArray.length
            var imageCounter = 0
            $scope.imagesAreLoading = true
            filesArray.forEach((imageBlob) => { 
                loadImages(imageBlob, (err, imageWithName) => {
                    imageCounter++;
                    if(err) {
                        console.log(err)
                    }
                    else {
                        $scope.imagesToPreview.push(imageWithName)
                    }
                    
                    // When we prepared all the image we stop the loading animation.
                    if(imageCounter == numberOfFiles) {
                        $scope.imagesAreLoading = false
                        $scope.$apply()
                    }
                })
            })
        }
    }
    
    function loadImages(imageBlob, callback) {
        try {
            const reader = new FileReader()
            
            // Onload gets call when the image has finished to load.
            reader.onload = () => {
                const image = new Image()
                
                image.onload = () => {
                    // Here we build a custom object that contains the HTML Image
                    // with its name, since the Image object doesn't have a "name" property.
                    const imageWithName = {
                        image: image,
                        name: imageBlob.name
                    }
                    callback(null, imageWithName)
                }
                
                image.src = reader.result
            }
            reader.readAsDataURL(imageBlob)
        }
        catch(err) {
            callback(err, null)
        }
    }
    //Creates an image object with the existing images associated with product
    function createImageFromDatabase(imgUrl){
        const image = new Image()
        image.src = imgUrl
        image.onload = () => {
            // Here we build a custom object that contains the HTML Image
            // with its name, since the Image object doesn't have a "name" property.
            const imageWithName = {
                image: image,
                name: imgUrl,
            }
            $scope.existingImages.push(imageWithName)
        }
        console.log($scope.existingImages);
    }
    
}]);
