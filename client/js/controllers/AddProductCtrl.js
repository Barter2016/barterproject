angular.module('BarterApp').controller('AddProductCtrl', ['$scope','GetService','AddService','FacebookService', function($scope, GetService, AddService,FacebookService) {

   GetService.scanAllProducts((err, products) => {
        if(err) {
            console.log(err)
        }
        else {
            $scope.products = products
            console.log($scope.products)
            $scope.$apply()
        }
    })
    GetService.scanAllCategories((err, categories) => {
        if(err) {
            console.log(err)
        }
        else {
            $scope.categories = categories
            console.log($scope.categories)
            $scope.$apply()
        }
    })
    //getCurrentUserInfo : (callback) => FB.api('/me', (userInfo) => callback(userInfo))
    $scope.addProduct = function(new_product){
        //hardcoder les tags pour l'instants
        new_product.product_tags = "product";
        new_product.user_email = "gaylord@gmail.com";
        //console.log(new_product);
        AddService.addProduct(new_product,(err, data) => {
            if(err) {
                console.log(err)
            }
            else {
                console.log(data)
            }
        })
    }
}]);





