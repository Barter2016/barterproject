angular.module('BarterApp').controller('ProductCtrl', ['$scope','$routeParams','ProductService',function($scope, $routeParams, ProductService) {
    const product_id = $routeParams.id
    console.log($routeParams.id)
    
    ProductService.queryProduct(product_id,(err, product) => {
        if (err) {
            console.log(err)
             //window.location.href = ''
        }
        else {
            console.log(product[0].product_name.S)
            $scope.selected_product = product
            $scope.data_loaded = $scope.selected_product
        }
    })
}]);
