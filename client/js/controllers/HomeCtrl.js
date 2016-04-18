angular.module('BarterApp').controller('HomeCtrl', ['$scope',
    'UtilService',
    'ProductService',
    'CategoryService',
    'LocalStorageService',
    'ProductHistoryService',
    'MessageService',
    '$mdDialog',
    'AuthService',
    'ImageService',
    'OfferService',
    function($scope,
        UtilService,
        ProductService,
        CategoryService,
        LocalStorageService,
        ProductHistoryService,
        MessageService,
        $mdDialog,
        AuthFactory,
        ImageService,
        OfferService,
        GoogleMapService) {
        $scope.is_auth = false
        $scope.categories = [] // Save the last scanned categories in an array.
        var productsInCache = [] // Save the last scanned products in an array.
        $scope.productsToDisplay = []
        $scope.productNameToFind;
        $scope.selectedCategory
        $scope.go = UtilService.go
        $scope.data_loaded = false
        $scope.refreshProducts = refreshProducts;
        
        // We start by showing 10 products.
        var numberOfShownProduct = 10;
        
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

        function refreshProducts(numberOfProducts) {
            $scope.data_loaded = false;
            ProductService.scanAllProducts((err, products) => {
                if (err) {
                    console.log(err)
                }
                else {
                    products.forEach((product) => {
                        const d = product.product_date.S
                        const date = new Date(d)
                        product.product_date = date
                    })
                    productsInCache = products
                    $scope.productsToDisplay = products
                    $scope.data_loaded = $scope.productsToDisplay.length > 0 && $scope.categories.length > 0
                    $scope.$apply()
                }
            }, numberOfProducts)
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
            ProductService.searchProduct($scope.productNameToFind, $scope.selectedCategory, (err, products) => {
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


        $scope.doOffer = (selectedProduct) => {
            if (selectedProduct && selectedProduct.product_id) {
                UtilService.go('/Offer/' + selectedProduct.product_id.S)
            }
        }

        $scope.sendNewMessageDialog = (event, product_user_email) => {
            MessageService.sendNewMessage(event, product_user_email)
        }

        if (productsInCache.length == 0 && AuthFactory.checkIfAuth()) {
            refreshProducts(numberOfShownProduct)
        }

        if ($scope.categories.length == 0 && AuthFactory.checkIfAuth()) {
            refreshCategories()
        }

        $scope.viewProduct = (product) => {
            window.location.href = '/#/Product/' + product;
        }
        
        $scope.loadMoreProduct = () => {
            numberOfShownProduct += 10
            refreshProducts(numberOfShownProduct)
        }
    }
]);