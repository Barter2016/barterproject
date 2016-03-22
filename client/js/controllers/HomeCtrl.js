angular.module('BarterApp').controller('HomeCtrl', ['$scope', 
'UtilService', 
'ProductService', 
'CategoryService', 
'LocalStorageService',
'ProductHistoryService', function($scope, UtilService, ProductService, CategoryService, LocalStorageService, ProductHistoryService) {
    
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
            const test = ProductHistoryService.goBack($scope.productsToDisplay)
            console.log('goback: ' + test.length)
            $scope.productsToDisplay = test
        }
    }
    
    $scope.goFowardInHistory = () => {
        const currentProductDisplayed = $scope.productsToDisplay
        if(currentProductDisplayed) {
            const test = ProductHistoryService.goFoward(currentProductDisplayed)
            console.log("gofoward: " + test.length)
            $scope.productsToDisplay = test
        }
    }
    
    $scope.searchProduct = () => {
        ProductService.searchProductByName($scope.productNameToFind, $scope.selectedCategory, (err, products) => {
            if(err) {
                console.log(err)
                $scope.productsToDisplay = ProductService.productsInCache
            }
            else {
                
                // Before swaping the product displayed with the search results we save our current state.
                ProductHistoryService.saveInHistory(ProductService.productsInCache,
                    ProductHistoryService.backwardStack)
                $scope.productsToDisplay = products
            }
        })
    }

    if(productsInCache.length == 0 
        && checkIfAuth()) {
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