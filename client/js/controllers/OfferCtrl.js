angular.module('BarterApp').controller('OfferCtrl', ['$scope',
    '$location',
    '$routeParams',
    'ProductService',
    'UtilService',
    'LocalStorageService',
    'GoogleMapService',
    
    function($scope, $location, $routeParams, ProductService, UtilService, LocalStorageService) {
        const user = LocalStorageService.getObject('user')

        $scope.selectedProduct; // The product that the user has selected.
        $scope.userProducts;
       

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
        
        
        $scope.testGoogleMap = () => {
            
        }

        /**
         * ICI C'EST LE CODE POUR SÉLECTIONNER DES PRODUITS ET LES UNSELECT.
         */ 
        $scope.productToOffer = []
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
