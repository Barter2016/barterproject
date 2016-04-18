angular.module('BarterApp').controller('EditProductCtrl', ['$scope','$routeParams','ProductService','CategoryService','AuthService','LocalStorageService','BucketService','ImageService','$route','UtilService',function($scope, $routeParams, ProductService,CategoryService,AuthService,LocalStorageService,BucketService,ImageService,$route,UtilService) {
    
    const product_id = $routeParams.id
    const user = LocalStorageService.getObject('user')
    $scope.currentImgIndex = 0;
    $scope.existingImages = [];
    $scope.imagesToDelete = [];
    $scope.new_images = [];
    queryProduct();
    //get categories for select list
    CategoryService.scanAllCategories((err, categories) => {
        if (err) {
            console.log(err)
        }
        else {
            $scope.categories = categories
            $scope.data_loaded = $scope.categories && $scope.new_product && $scope.imagesToPreview
            $scope.$apply()
            
        }
    })
    //get selected product info
    function queryProduct(){
        ProductService.queryProduct(product_id,(err, product) => {
            if (err) {
                console.log(err)
            }
            else {
                $scope.new_product = product;
                $scope.new_product.product_name = product.product_name.S
                $scope.new_product.product_description = product.product_description.S
                $scope.new_product.category_id = product.category_id.S
                console.log($scope.new_product.image_urls.SS)
                //create images object to show current product images
                for(var i = 0;i<$scope.new_product.image_urls.SS.length;i++){
                    createImageFromDatabase($scope.new_product.image_urls.SS[i])
                }
                
                //display current product images
                $scope.imagesToPreview = $scope.existingImages
                $scope.data_loaded = $scope.categories && $scope.new_product && $scope.imagesToPreview
                $scope.$apply()
            }
        })
    }
    
    
    //function to actually edit the product
    $scope.editProduct = (new_product) => {
        var addedImages = false;
        if(AuthService.checkIfAuth()) {
            //hardcoder les tags pour l'instants
            new_product.product_tags = "product"
            new_product.product_id = product_id
            new_product.user_email = user.email
            new_product.image_urls = $scope.new_product.image_urls.SS
            console.log(new_product)
            if(new_product.image_urls.length < 1){
                alertify.error("Veuillez ajouter une deuxième image et sauvegarder avant de procéder")
                $route.reload();
            }else{
                ProductService.updateProduct(new_product, (err, productId) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log("No error from edit product")
                        if($scope.new_images.length > 0){
                            const promise = ImageService.compressImages($scope.new_images)
                            
                            promise
                                .then((blobCollection) => {
                                    BucketService.uploadFile(blobCollection, (err, data) => {
                                        if (err) {
                                            console.log(err)
                                        }
                                        else {
                                            ProductService.addImageToProduct(new_product.product_id, [data.Location], (err, data) => {
                                                if (err) {
                                                    console.log(err)
                                                }
                                                else {
                                                    $scope.viewProduct(new_product.product_id)
                                                }
                                            })
                                        }
                                    })
                                    
                                }, (err) => console.log(err))
                                .finally(() => {
                                    $scope.data_loaded = true
                                    $route.reload();
                                })
                        }
                         $scope.viewProduct(new_product.product_id)
                    }
                })
            }
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
    };
    
    //function that removes an image from the image_urls array
    //once the user clicks on "modify product", the product will not be associated with those images anymore
    $scope.removeImageFromProduct = () => {
        console.log($scope.new_product.image_urls.SS[0])
        console.log($scope.new_product.image_urls.SS[1])
        console.log($scope.currentImgIndex)
        if($scope.imagesToPreview[$scope.currentImgIndex].type == "existing")
            $scope.new_product.image_urls.SS.splice($scope.currentImgIndex, 1)
            
        $scope.imagesToDelete.push($scope.imagesToPreview[$scope.currentImgIndex])
        $scope.imagesToPreview.splice($scope.currentImgIndex,1)
        
        //corrects the index to display last ok image
        if($scope.currentImgIndex != 0)
            $scope.currentImgIndex--;
        console.log($scope.new_product.image_urls.SS[0])
        console.log($scope.new_product.image_urls.SS[1])
    }
    $scope.undoRemoveImageFromProduct = () => {
        if($scope.imagesToDelete[$scope.imagesToDelete.length-1].type == "existing")
            $scope.new_product.image_urls.SS.push($scope.imagesToDelete[$scope.imagesToDelete.length-1].image.src)
        
        $scope.imagesToPreview.push($scope.imagesToDelete[$scope.imagesToDelete.length-1])
        $scope.imagesToDelete.pop()
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
                        $scope.new_images.push(imageWithName)
                        console.log($scope.new_images)
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
                        name: imageBlob.name,
                        type:"new"
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
        image.crossOrigin="anonymous"
        image.src = imgUrl
        image.onload = () => {
            // Here we build a custom object that contains the HTML Image
            // with its name, since the Image object doesn't have a "name" property.
            const imageWithName = {
                image: image,
                name: imgUrl,
                type: "existing"
            }
            $scope.existingImages.push(imageWithName)
            //console.log($scope.existingImages)
            $scope.$apply()
        }
    }
    $scope.viewProduct = (product) => {
        UtilService.go('/Product/' + product)
    }

}]);
