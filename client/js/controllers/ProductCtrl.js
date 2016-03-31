angular.module('BarterApp').controller('ProductCtrl', ['$scope','$routeParams','ProductService',function($scope, $routeParams, ProductService) {
    
    const product_id = $routeParams.id

    $scope.edit = $routeParams.edit
  
    ProductService.queryProduct(product_id,(err, product) => {
        if (err) {
            console.log(err)
        }
        else {
            $scope.selected_product = product[0]
            $scope.data_loaded = $scope.selected_product
            console.log(product[0].image_names.SS)
            $scope.$apply()
            console.log($scope.selected_product.image_names.SS[0])
        }
    })
    
    $scope.editProduct = (new_product) => {
        
        if(AuthService.checkIfAuth()) {
        
            //hardcoder les tags pour l'instants
            new_product.product_tags = "product";
            new_product.user_email = user.email;
            
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

}]);
