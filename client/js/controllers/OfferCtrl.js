angular.module('BarterApp').controller('OfferCtrl', ['$scope',
    '$location',
    '$routeParams',
    'ProductService',
    'UtilService',
    'LocalStorageService',

    function($scope, $location, $routeParams, ProductService, UtilService, LocalStorageService) {
        const id = $routeParams.id
        const user = LocalStorageService.getObject('user')

        $scope.selectedProduct; // The product that the user has selected.
        $scope.dataLoaded = false
        $scope.userProducts;
        $scope.productToOffer = []
        
        // If there's no query string.
        if (!id) {
            UtilService.goApply('/Home')
        }

        ProductService.queryProduct(id, (err, products) => {
            if (products && products.length > 0) {
                $scope.selectedProduct = products[0]
                console.log('found')
                $scope.dataLoaded = true
                $scope.$apply()
            }
            else {
                UtilService.go('/Home', true)
            }
        })

        // If we manage to succeed the product request to AWS. We will try to get the user posts.
        ProductService.scanProductsByUser(user.email, (err, userProducts) => {
            if (err) {
                console.log(err)
            }
            else {
                $scope.userProducts = userProducts
                console.log(userProducts)
                $scope.$apply()
            }
        })


        $scope.onProductChecked = (productChecked) => {
            const index = $scope.productToOffer.indexOf(productChecked)
            
            // If this product is in our list we remove it, otherwise we add it.
            if(index > -1) {
                $scope.productToOffer.splice(index, 1)
            }
            else {
                $scope.productToOffer.push(productChecked)
            }
        }

    }
]);
