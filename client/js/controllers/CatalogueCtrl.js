angular.module('BarterApp').controller('CatalogueCtrl', ['$scope',
'ProductService', 
'CategoryService', 
'LocalStorageService',
'AuthService',
'BucketService', function($scope, ProductService, CategoryService, LocalStorageService, AuthService, BucketService) {
    const user = LocalStorageService.getObject('user')
    $scope.data_loaded = false
    $scope.products
    $scope.categories
    
    ProductService.scanProductsByUser(user.email, (err, products) => {
        if (err) {
            console.log(err)
        }
        else {
            $scope.products = products
            console.log(products)
            $scope.data_loaded = $scope.categories && $scope.products 
            $scope.$apply()
        }
    })

    CategoryService.scanAllCategories((err, categories) => {
        if (err) {
            console.log(err)
        }
        else {
            $scope.categories = categories
            $scope.data_loaded = $scope.categories && $scope.products
            $scope.$apply()
            
        }
    })
    
    $scope.addProduct = (new_product) => {
        
        if(AuthService.checkIfAuth()) {
        
            //hardcoder les tags pour l'instants
            new_product.product_tags = "product";
    
            new_product.user_email = user.email;
            
            console.log(new_product)
        
            ProductService.addProduct(new_product, (err, productId) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log(productId)
                    alertify.success("Le produit " + new_product.product_name + " a été créé avec succès")
    
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
    $scope.viewProduct = (product) => {
        window.location.href = '/#/Product/' + product;
    }
}]);
