angular.module('BarterApp').controller('HomeCtrl', ['$scope', 'UtilService', 'GetService', function($scope, UtilService, GetService) {

    $scope.project_name = "Barter Project"
    $scope.is_auth = false
    $scope.categories = [] // Save the last scanned categories in an array.
    var productsInCache =  [] // Save the last scanned products in an array.
    $scope.productsToDisplay = []
    $scope.productNameToFind;
    $scope.selectedCategory
    $scope.go = UtilService.go

    
    function refreshCategories() {
        GetService.scanAllCategories((err, categories) => {
            if (err) {
                console.log(err)
            }
            else {
                $scope.categories = categories
                $scope.$apply()
            }
        })
    }
    
    function refreshProducts() {
        GetService.scanAllProducts((err, products) => {
            if (err) {
                console.log(err)
            }
            else {
                productsInCache = products
                $scope.productsToDisplay = products
                $scope.$apply()
            }
        })
    }
    
    $scope.searchProduct = () => {
        if ($scope.productNameToFind) {
            
            console.log('productNameToFind: ' + $scope.productNameToFind)
            
            // If there is no products we try to scan them.
            if (productsInCache.length == 0) {
                refreshProducts()
            }
            
            const searchResult = productsInCache.filter((product) => {
                console.log(product.product_name)
                if(product.product_name.S == $scope.productNameToFind){
                    console.log('same name')
                    return true
                }
            })
            
            console.log('number of results: ' + searchResult.length)
            
            $scope.productsToDisplay = searchResult;
        }
    }
    
    refreshCategories()
    refreshProducts()
    
}]);