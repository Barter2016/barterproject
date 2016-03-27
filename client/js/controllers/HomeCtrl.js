angular.module('BarterApp').controller('HomeCtrl', ['$scope',
'UtilService',
'ProductService',
'CategoryService',
'LocalStorageService',
'ProductHistoryService',
'AuthService',
'ImageService',
function($scope, UtilService, ProductService, CategoryService, LocalStorageService, ProductHistoryService, AuthFactory, ImageService) {

        $scope.is_auth = false
        $scope.categories = [] // Save the last scanned categories in an array.
        var productsInCache = [] // Save the last scanned products in an array.
        $scope.productsToDisplay = []
        $scope.productNameToFind;
        $scope.selectedCategory
        $scope.go = UtilService.go
        $scope.data_loaded = false

        $scope.categoryChanged = () => {
            try {
                const selectedCategoryName = $scope.selectedCategory.category_name.S
            }
            catch (err) {
                console.log(err)
            }
        }

        function refreshCategories() {
            CategoryService.scanAllCategories((err, categories) => {
                if (err) {
                    console.log(err)
                }
                else {
                    $scope.categories = categories
                    $scope.data_loaded = $scope.productsToDisplay.length > 0 && $scope.categories.length > 0
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
                    $scope.data_loaded = $scope.productsToDisplay.length > 0 && $scope.categories.length > 0
                    $scope.$apply()
                }
            })
        }

        $scope.goBackInHistory = () => {
            if ($scope.productsToDisplay && ProductHistoryService.backwardStack.length > 0) {
                $scope.productsToDisplay = ProductHistoryService.goBack($scope.productsToDisplay)
            }
        }

        $scope.goFowardInHistory = () => {
            if ($scope.productsToDisplay && ProductHistoryService.forwardStack.length > 0) {
                $scope.productsToDisplay = ProductHistoryService.goFoward($scope.productsToDisplay)
            }
        }

        $scope.searchProduct = () => {
            ProductService.searchProductByName($scope.productNameToFind, $scope.selectedCategory, (err, products) => {
                if (err) {
                    console.log(err)
                    $scope.productsToDisplay = ProductService.productsInCache
                }
                else {
                    // Before swaping the product displayed with the search results we save our current state.
                    ProductHistoryService.saveInHistory($scope.productsToDisplay,
                        ProductHistoryService.backwardStack)

                    // Clear the forward history since we are deviating from our browsing history.
                    ProductHistoryService.clearForwardHistory()
                    $scope.productsToDisplay = products
                }
            })
        }

        if (productsInCache.length == 0 && AuthFactory.checkIfAuth()) {
            refreshProducts()
        }

        if ($scope.categories.length == 0 && AuthFactory.checkIfAuth()) {
            refreshCategories()
        }

    }
]);