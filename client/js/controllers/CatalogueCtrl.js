angular.module('BarterApp').controller('CatalogueCtrl', ['$scope',
'ProductService', 
'CategoryService', 
'LocalStorageService',
'BucketService', 
'AuthService', function($scope, ProductService, CategoryService, LocalStorageService, BucketService) {
    const user = LocalStorageService.getObject('user')
    $scope.data_loaded = false
    $scope.products = []
    $scope.categories = []
    
    ProductService.scanProductsByUser(user.email, (err, products) => {
        if (err) {
            console.log(err)
        }
        else {
            $scope.products = products
            console.log(products[0].image_names['SS'][0])
            $scope.data_loaded = $scope.categories.length > 0 && $scope.products.length > 0 
            $scope.$apply()
        }
    })

    CategoryService.scanAllCategories((err, categories) => {
        if (err) {
            console.log(err)
        }
        else {
            $scope.categories = categories
            $scope.data_loaded = $scope.categories.length > 0 && $scope.products.length > 0 
            $scope.$apply()
            
        }
    })
    
    $scope.addProduct = function(new_product) {
        
        if(AuthService.checkIfAuth()) {
        
            //hardcoder les tags pour l'instants
            new_product.product_tags = "product";
    
            new_product.user_email = user.email;
        
            ProductService.addProduct(new_product, (err, data) => {
                if (err) {
                    console.log(err)
                }
                else {
                    alert("Le produit " + new_product.product_name + "a été créé avec succès");
    
                    const file = document.getElementById('imageFile').files[0]
                    
                    BucketService.uploadFile(file,(err, data) =>{
                        if (err) {
                            console.log(err)
                        }else{
                           new_product.image_url = data.Location
    
                            AddService.addProductImage(new_product.product_image_url, (err, data) => {
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
