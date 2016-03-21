angular.module('BarterApp').controller('HomeCtrl', ['$scope', 
'UtilService', 
'ProductService', 
'CategoryService', 
'LocalStorageService',
'HistoryService', function($scope, UtilService, ProductService, CategoryService, LocalStorageService, HistoryService) {
    $scope.project_name = "Barter Project"
    $scope.is_auth = false
    $scope.categories = [] // Save the last scanned categories in an array.
    var productsInCache =  [] // Save the last scanned products in an array.
    $scope.productsToDisplay = []
    $scope.productNameToFind;
    $scope.selectedCategory
    $scope.go = UtilService.go
    
    $scope.categoryChanged = () => {
        try{
            const selectedCategoryName = $scope.selectedCategory.category_name.S
        } catch(err) {
           console.log(err) 
        }
    }
    
    
    function refreshCategories() {
        CategoryService.scanAllCategories((err, categories) => {
            if (err) {
                console.log(err)
            }
            else {
                categories.splice(0, 0, { category_id: undefined, category_name:{ "S" : "Aucune" } });
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
    
    
    $scope.goBackInHistory = () => {
        if($scope.productsToDisplay) {
            $scope.productsToDisplay = HistoryService.goBack($scope.productsToDisplay)
        }
    }
    
    $scope.goFowardInHistory = () => {
        if($scope.productsToDisplay) {
            $scope.productsToDisplay = HistoryService.goFoward($scope.productsToDisplay)
        }
    }
    
    
    /**
     * Search a product by the product name (if provided) and by a category if the category exists.
     */
    $scope.searchProduct = () => {

        if ($scope.productNameToFind
            && $scope.productNameToFind.length > 0) {
            
            var searchResult = productsInCache.filter((product) => {
                // If the product_name contains the searching name, then return true
                return product.product_name.S.toLowerCase()
                .indexOf($scope.productNameToFind.toLowerCase()) > -1
            })
            
            // If the user has selected a category.
            if($scope.selectedCategory
                && $scope.selectedCategory.category_id !== undefined) {
                
                // Filter by the selected category
                searchResult = searchResult.filter((product) => { 
                    return product.category_name.S == $scope.selectedCategory.category_name.S 
                })
            }
            
            HistoryService.saveInHistory($scope.productsToDisplay, HistoryService.backwardStack)
            $scope.productsToDisplay = searchResult
        }
        else {
            HistoryService.saveInHistory($scope.productsToDisplay, HistoryService.backwardStack)
            $scope.productsToDisplay = productsInCache
        }
        
    }

    if(productsInCache.length == 0 
    && checkIfAuth()){
        refreshProducts()
    }
    if($scope.categories.length == 0 
    && checkIfAuth()) {
        refreshCategories()
    }
    
    function checkIfAuth() {
        var local_session = LocalStorageService.getObject('local_session')
        if (local_session) {
            AWS.config.region = 'us-east-1'
            AWS.config.credentials = new AWS.CognitoIdentityCredentials(local_session)
        } 
        return local_session
    }
    
}]);