angular.module('BarterApp').controller('CatalogueCtrl', ['$scope',
    'ProductService',
    'CategoryService',
    'LocalStorageService',
    'AuthService',
    'BucketService',
    'UtilService',
    'ImageService',
    '$mdDialog',
    function($scope, ProductService, CategoryService, LocalStorageService, AuthService, BucketService, UtilService, ImageService, $mdDialog) {
        const user = LocalStorageService.getObject('user')
        $scope.data_loaded = false
        $scope.products
        $scope.categories
        $scope.imagesToUpload = []
        $scope.imagesToPreview = []
        $scope.currentImgIndex = 0;
        $scope.imagesAreLoading = false;

        refreshUserProduct()
        getCategories()

        function refreshUserProduct() {
            //obtient les produits de l'utilisateur pour les ajouter dans le scope de la page
            ProductService.scanProductsByUser(user.email, (err, products) => {
                if (err) {
                    console.log(err)
                }
                else {
                    products.forEach((product) => {
                        const d = product.product_date.S
                        const date = new Date(d)
                        product.product_date = date
                    })
                    $scope.products = products
                    $scope.data_loaded = $scope.categories && $scope.products
                    $scope.$apply()
                }
            })
        }

        function getCategories() {
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
        }

        $scope.fileChanged = () => {
            // document.getElement return an HTMLCollection, therefore you must convert it to an array.
            const filesHTMLCollection = document.getElementById('imageFile').files

            // HTMLColllection to array.
            const filesArray = [].slice.call(filesHTMLCollection)

            if (filesArray.length > 0) {
                $scope.imagesToPreview = [] // We clear our image preview array.
                const numberOfFiles = filesArray.length
                var imageCounter = 0
                $scope.imagesAreLoading = true
                filesArray.forEach((imageBlob) => {
                    loadImages(imageBlob, (err, imageWithName) => {
                        imageCounter++;
                        if (err) {
                            console.log(err)
                        }
                        else {
                            $scope.imagesToPreview.push(imageWithName)
                        }

                        // When we prepared all the image we stop the loading animation.
                        if (imageCounter == numberOfFiles) {
                            $scope.imagesAreLoading = false
                            $scope.$apply()
                        }
                    })
                })
            }
        }

        /**
         * Load an image to the server
         * 
         * params {imageBlob} is the image file to load from the input.
         * params {callback} is the the function that will be call after the method has finish to run.
         */
        function loadImages(imageBlob, callback) {
            try {
                const reader = new FileReader()

                // Onload gets call when the image has finished to load.
                reader.onload = () => {
                    const image = new Image()
                    image.onload = () => {
                        // Here we build a custom object that contains the HTML Image
                        // with its name, since the Image object doesn't have a "name" property.
                        const imageWithName = {
                            image: image,
                            name: imageBlob.name
                        }
                        callback(null, imageWithName)
                    }

                    image.src = reader.result
                }
                reader.readAsDataURL(imageBlob)
            }
            catch (err) {
                callback(err, null)
            }
        }

        $scope.addProduct = (new_product) => {
            $scope.data_loaded = false

            if (AuthService.checkIfAuth()) {
                //hardcoder les tags pour l'instants
                new_product.product_tags = "product";

                new_product.user_email = user.email;

                ProductService.addProduct(new_product, (err, productid) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        if ($scope.imagesToPreview.length > 0) {
                            const promise = ImageService.compressImages($scope.imagesToPreview)
                            promise
                                .then((blobCollection) => {
                                    BucketService.uploadFile(blobCollection, (err, data) => {
                                        if (err) {
                                            alertify.error("Une erreur est subvenue lors de l'envoi d'image.")
                                        }
                                        else {
                                            ProductService.addImageToProduct(productid, [data.Location], (err, data) => {
                                                if (err) {
                                                    alertify.error("Une erreur est subvenue lors de l'association de l'image au produit.")
                                                }
                                                else {
                                                    UtilService.go('/Product/' + productid, true)
                                                }
                                            })
                                        }
                                    })
                                }, (err) => { 
                                    $scope.data_loaded = true
                                    alertify.error("Une erreur est subvenue lors de l'envoi d'image.") 
                                })
                        }
                        else {
                            UtilService.go('/Product/' + productid, true)
                        }
                    }

                })
            }
        }
        $scope.viewProduct = (productid) => {
            UtilService.go('/Product/' + productid)
        }
        $scope.editProduct = (productid) => {
            UtilService.go('/EditProduct/' + productid)
        }
        
        $scope.setCurrentImgIndex = (index) => {
            $scope.currentImgIndex = index;
        };

        $scope.isCurrentImgIndex = (index) => {
            return $scope.currentImgIndex === index;
        };
        //function to show next image in the preview box
        $scope.showNextImg = () => {
            $scope.currentImgIndex = ($scope.currentImgIndex < $scope.imagesToPreview.length - 1) ? ++$scope.currentImgIndex : 0;
        };
        //function to show previous image in the preview box
        $scope.showPreviousImg = () => {
            $scope.currentImgIndex = ($scope.currentImgIndex > 0) ? --$scope.currentImgIndex : $scope.imagesToPreview.length - 1;
        };

        $scope.deleteProduct = (ev, product) => {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Voulez vous vraiment supprimer le produit ' + product.product_name.S + '?')
                .textContent('La suppression du produit est non réversible')
                .ariaLabel('Suppression')
                .targetEvent(ev)
                .ok('Confirmer')
                .cancel('Annuler');

            $mdDialog.show(confirm).then(() => {
                ProductService.deleteProduct(product, (err, productId) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        alertify.success("Le produit " + product.product_name.S + " a été supprimé avec succès")
                        refreshUserProduct();
                        $scope.$apply();
                    }
                })
            }, () => {
                $scope.status = 'Suppression annulé';
            });

        };

        function clearAddProductForm() {
            $scope.new_product = {}
        }
        

    }
]);
