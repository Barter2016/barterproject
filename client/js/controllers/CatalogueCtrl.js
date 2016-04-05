angular.module('BarterApp').controller('CatalogueCtrl', ['$scope',
'ProductService', 
'CategoryService', 
'LocalStorageService',
'AuthService',
'BucketService',
'UtilService',
'$window',
function($scope, ProductService, CategoryService, LocalStorageService, AuthService, BucketService, UtilService, $window) {
    const user = LocalStorageService.getObject('user')
    $scope.data_loaded = false
    $scope.products
    $scope.categories
    $scope.imagesToUpload = {}
    
    //obtient les produits de l'utilisateur pour les ajouter dans le scope de la page
    ProductService.scanProductsByUser(user.email, (err, products) => {
        if (err) {
            console.log(err)
        }
        else {
            $scope.products = products
            console.log(products)
            $scope.data_loaded = $scope.categories && $scope.products 
            $scope.$apply()
        }
    })

    //obtient toutes les catégories pour les ajouter dans le scope de la page
    CategoryService.scanAllCategories((err, categories) => {
        if (err) {
            console.log(err)
        }
        else {
            $scope.categories = categories
            $scope.data_loaded = $scope.categories && $scope.products
            $scope.$apply()
            
        }
    })
    
    $scope.fileChanged = () => {
        // document.getElement return an HTMLCollection, therefore you must convert it to an array.
        const filesHTMLCollection = document.getElementById('imageFile').files
        
        // HTMLColllection to array.
        const filesArray = [].slice.call(filesHTMLCollection)
        
        const reader = new FileReader()
        
        reader.onload = () => {
            console.log("on load")
            const image = new Image()
            const canvas = document.getElementById("canvasImagePreview")
            const canvasContext = canvas.getContext("2d")
            
            image.onload = () => {
                // TODO call the image service.    
            }
            
            image.src = reader.result
            console.log(reader)
        }
        
        reader.readAsDataURL(filesArray[0])
    }
        
    //Fonction qui ajoute un nouveau produit dans la base de données
    $scope.addProduct = (new_product) => {
        
        if(AuthService.checkIfAuth()) {
        
            //hardcoder les tags pour l'instants
            new_product.product_tags = "product";
    
            new_product.user_email = user.email;
            
            console.log(new_product)
        
            ProductService.addProduct(new_product, (err, productid) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log(productid)
                    alertify.success("roduit " + new_product.product_name + " a été créé avec succès")
    
                    // document.getElement return an HTMLCollection, therefore you must convert it to an array.
                    const filesHTMLCollection = document.getElementById('imageFile').files
                    
                    // HTMLColllection to array.
                    const filesArray = [].slice.call(filesHTMLCollection)
                    
                    BucketService.uploadFile(filesArray, (err, data) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            ProductService.addImageToProduct(productid, data.Location, (err, data) => {
                                if (err) {
                                    console.log(err)
                                }
                            })
                        }
                    })
                }
            })
        }
    }
    $scope.viewProduct = (product) => {
        //window.location.href = '/#/Product/' + product;
        UtilService.go('/Product/' + product)
    }
    $scope.editProduct = (product) => {
        UtilService.go('/EditProduct/' + product)
    }
}]);
