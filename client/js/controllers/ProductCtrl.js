angular.module('BarterApp').controller('ProductCtrl', ['$scope', 
'$routeParams', 
'$mdDialog', 
'LocalStorageService', 
'ProductService', 
'MessageService', 
'OfferService',
function($scope, $routeParams, $mdDialog, LocalStorageService, ProductService, MessageService, OfferService) {
    const currentUser = LocalStorageService.getObject('user')
    const product_id = $routeParams.id
    $scope.edit = $routeParams.edit
    $scope.data_loaded = false;
    $scope.currentImgIndex = 0;
    $scope.productToOffer = []
    $scope.userProducts = []
    
    ProductService.queryProduct(product_id, (err, product) => {
        if (err) {
            console.log(err)
        }
        else {
            $scope.selected_product = product[0]
            $scope.data_loaded = $scope.selected_product
            $scope.$apply()
        }
    })

    ProductService.scanProductsByUser(currentUser.email, (err, products) => {
        if (err) {
            console.log(err)
        }
        else {
            $scope.userProducts = products
            $scope.$apply()
        }
    })

    $scope.setCurrentImgIndex = (index) => {
        $scope.currentImgIndex = index;
    };

    $scope.isCurrentImgIndex = (index) => {
        return $scope.currentImgIndex === index;
    };

    $scope.showNextImg = () => {
        $scope.currentImgIndex = ($scope.currentImgIndex > 0) ? --$scope.currentImgIndex : $scope.selected_product.image_names['SS'].length - 1;
    };

    $scope.showPreviousImg = () => {
        $scope.currentImgIndex = ($scope.currentImgIndex < $scope.selected_product.image_names['SS'].length - 1) ? ++$scope.currentImgIndex : 0;
    };

    /*
     * Opens up a new window that allows the user to reply to an existing message in the list.
     *
     * param="ev" The event that the user did.
     * param="notification" The notification in JSON format the will be replied.
     */
    $scope.newMessage = (event, product) => {
        LocalStorageService.set('selected_product', JSON.stringify(product))
        $mdDialog.show({
            controller: NewMessageCtrl,
            templateUrl: 'templates/NewMessage.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true,
            fullscreen: true
        })
    }


    $scope.onProductChecked = (productChecked) => {
        const index = $scope.productToOffer.indexOf(productChecked)

        // If this product is in our list we remove it, otherwise we add it.
        if (index > -1) {
            $scope.productToOffer.splice(index, 1)
            console.log('removed')
        }
        else {
            $scope.productToOffer.push(productChecked)
            console.log('added')
        }
    }

    $scope.showConfirm = function(ev) {
        // Be sure the user has selected at least one product.
        if($scope.productToOffer.length > 0) {
            
            var resume = "Résumé de votre offre: "
                + "<br />"
                + "<ul>"
            
            $scope.productToOffer.forEach((product) => {
                resume += "<li>"
                    + product.product_name.S
                    + "</li>"
            })
            
            resume += "</ul>"
                
            // Appending dialog to document.body to cover sidenav in docs app
            const confirm = $mdDialog.confirm()
                .title('Êtes vous certain de vouloir faire cette offre?')
                .htmlContent(resume)
                .targetEvent(ev)
                .ok('Confirmer')
                .cancel('Annuler');
            $mdDialog.show(confirm)
            // Yes.
            .then(() => {
                const offer = []
                $scope.productToOffer.forEach((product) => offer.push(product.product_id.S))
                OfferService.addOffer(currentUser.email, offer, $scope.selected_product, (err, data) => {
                    if(err) {
                        console.log(err)
                    }
                    else {
                        console.log(data)
                    }
                })
            })
        }
    };

    /*
     * The controller that has the behavior of replying to existing messages.
     *
     * param="$scope" Angularjs' $scope.
     * param="$mdDialog" Angular Material's $mdDialog.
     * param="LocalStorageService" The service that allows to store data in the local storage of the browser.
     */
    function NewMessageCtrl($scope, $mdDialog, LocalStorageService) {
        const currentProduct = JSON.parse(LocalStorageService.get('selected_product'))
        const currentUser = JSON.parse(LocalStorageService.get('user'))
        $scope.selected_product = currentProduct
            /*
             * This function hides the $mdDialog window without any actions.
             */
        $scope.hide = function() {
            $mdDialog.hide()
        }

        /*
         * This function cancels the $mdDialog window with all its proceses.
         */
        $scope.cancel = function() {
            $mdDialog.cancel()
        }

        /*
         * Creates a new notification in the database.
         */
        $scope.sendNewMessage = function() {
            const messageObj = {
                message_text: $scope.messageText,
                message_sender_email: currentUser.email,
                message_sender_name: currentUser.name,
                message_sender_picture: currentUser.picture.data.url,
                message_receiver_email: currentProduct.user_email.S
            }

            MessageService.addMessage(messageObj, (err, newMessage) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log(newMessage);
                    $mdDialog.hide()
                }
            })
        }
    }

}]);