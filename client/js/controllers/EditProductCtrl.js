angular.module('BarterApp').controller('EditProductCtrl', ['$scope','$routeParams','ProductService','CategoryService','AuthService','LocalStorageService',function($scope, $routeParams, ProductService,CategoryService,AuthService,LocalStorageService) {
    
    const product_id = $routeParams.id
    const user = LocalStorageService.getObject('user')
    $scope.currentImgIndex = 0;
    
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
            $scope.selected_product = product[0]
            $scope.new_product = {};
            $scope.new_product.product_name = product[0].product_name.S
            $scope.new_product.product_description = product[0].product_description.S
            $scope.new_product.category_id = product[0].category_id.S
            $scope.new_product.image_names = $scope.selected_product.image_names
            $scope.data_loaded = $scope.categories && $scope.new_product
            $scope.$apply()
            console.log($scope.selected_product.image_names.SS[0])
        }
    })
    
    $scope.editProduct = (new_product) => {
        
        if(AuthService.checkIfAuth()) {
        
            //hardcoder les tags pour l'instants
            new_product.product_tags = "product"
            new_product.product_id = product_id
            new_product.user_email = user.email
            new_product.image_names = $scope.selected_product.image_names.SS
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

    $scope.setCurrentImgIndex = (index) => {
        $scope.currentImgIndex = index;
    };

    $scope.isCurrentImgIndex = (index) => {
        return $scope.currentImgIndex === index;
    };
    
    $scope.showNextImg = () => {
        $scope.currentImgIndex = ($scope.currentImgIndex > 0) ? --$scope.currentImgIndex : $scope.selected_product.image_names['SS'].length - 1;
    };
    
    $scope.showPreviousImg = () => {
        $scope.currentImgIndex = ($scope.currentImgIndex < $scope.selected_product.image_names['SS'].length - 1) ? ++$scope.currentImgIndex : 0;
    };
    
    $scope.removeImageFromProduct = (imageIndex) => {
        delete $scope.selected_product.image_names.SS[imageIndex];
        //$scope.$apply();
        console.log($scope.new_product);
    }
}]);
