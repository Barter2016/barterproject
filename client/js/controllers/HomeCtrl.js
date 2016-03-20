angular.module('BarterApp').controller('HomeCtrl', ['$scope', 'UtilService', 'ProductService', 'CategoryService', function($scope, UtilService, ProductService, CategoryService) {

    $scope.project_name = "Barter Project"
    $scope.is_auth = false
    $scope.categories = [] // Save the last scanned categories in an array.
    var productsInCache =  [] // Save the last scanned products in an array.
    $scope.productsToDisplay = []
    $scope.productNameToFind;
    $scope.selectedCategory
    $scope.go = UtilService.go

    
    function refreshCategories() {
        CategoryService.scanAllCategories((err, categories) => {
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
        ProductService.scanAllProducts((err, products) => {
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
        
        // If there is no products we try to scan them.
        if (productsInCache.length == 0) {
            refreshProducts()
        }
        
        if ($scope.productNameToFind
            && $scope.productNameToFind.length > 0) {
            
            console.log('productNameToFind: ' + $scope.productNameToFind)
            
            const searchResult = productsInCache.filter((product) => {
                // If the product_name contains the searching name, then return true
                return product.product_name.S.toLowerCase()
                .indexOf($scope.productNameToFind.toLowerCase()) > -1
            })
            
            // If the user has selected a category.
            if($scope.selectedCategory) {
                // Filter by the selected category
                searchResult = searchResult.filter((product) => { 
                    return product.category.category_name.S == $scope.selectedCategory.category_name.S 
                })
            }
            
            console.log('search result length: ' + searchResult.length)
            $scope.productsToDisplay = searchResult
        }
        else {
            $scope.productsToDisplay = ProductService.productsInnerJoinCategory(productsInCache)
        }
    }
    
    if(productsInCache.length == 0){
        refreshProducts()
    }
    if($scope.categories.length == 0) {
        refreshCategories()
    }
    
}]);