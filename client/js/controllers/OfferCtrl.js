angular.module('BarterApp').controller('OfferCtrl', ['$scope', 
'$location', 
'$routeParams', 
'ProductService', 
'UtilService', function($scope, $location, $routeParams, ProductService, UtilService) {
    const id = $routeParams.id
    $scope.selectedProduct;     // The product that the user has selected.
    
    if(!id) {
        UtilService.goApply('/Home')
    }
    
    ProductService.queryProduct(id, (err, products) => {
        if(products
        && products.length > 0) {
            $scope.selectedProduct = products[0]
            console.log('product found')
            $scope.data_loaded = true
        }
        else {
            UtilService.go('/Home', true)
        }
    })
    
    
}]);
