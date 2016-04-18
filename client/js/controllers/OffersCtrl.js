angular.module('BarterApp').controller('OffersCtrl', ['$scope', 
'$mdDialog', 
'$mdToast', 
'$mdMedia',
'OfferService',
'MessageService',
'LocalStorageService',
function($scope, $mdDialog, $mdToast, $mdMedia, OfferService, MessageService, LocalStorageService) {
    const currentUser = JSON.parse(LocalStorageService.get('user'))
    $scope.data_loaded = false
    $scope.offers_sent_loaded = false;
    $scope.init = () => {
        scanOffersByReceiver()
    }
    
    /*
     * This sets in the scope the function that returns all the offers of a given user.
     */
    $scope.scanOffersByReceiver = () => {
        scanOffersByReceiver()
    }
    
    /*
     * This function scans and returns all the offers received by a given user.
     */
    function scanOffersByReceiver () {
        OfferService.scanOffersByReceiver(currentUser.email, (err, offers_received) => {
            if (err) {
                console.log(err)
            }
            else {
                $scope.offers_received = offers_received
                $scope.data_loaded = true
                $scope.$apply()
            }
        })
    }
    
    /*
     * This sets in the scope the function that returns all the offers sent by a given user.
     */
    $scope.scanOffersBySender = () => {
        scanOffersBySender()
    }
    
    /*
     * This function scans and returns all the offers sent by a given user.
     */
    function scanOffersBySender () {
        OfferService.scanOffersBySender(currentUser.email, (err, offers_sent) => {
            if (err) {
                console.log(err)
            }
            else {
                $scope.offers_sent = offers_sent
                $scope.offers_sent_loaded = true;
                $scope.$apply()
            }
        })
    }
    
    /*
     * Opens up a new window that allows the user to reply to an existing message in the list.
     *
     * param="ev" The event that the user did.
     * param="notification" The notification in JSON format the will be replied.
     */
    $scope.viewOffer = function(event, offer) {
        LocalStorageService.set('currentOffer', JSON.stringify(offer))

        $mdDialog.show({
            controller: ReplyOfferCtrl,
            templateUrl: 'templates/ViewOffer.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true,
            fullscreen: true
        })
        .then(function(answer) {
            scanOffersByReceiver()
        }, function() {
            scanOffersByReceiver()
        })
    }
    
    /*
     * The controller that has the behavior of replying to existing offer.
     *
     * param="$scope" Angularjs' $scope.
     * param="$mdDialog" Angular Material's $mdDialog.
     * param="LocalStorageService" The service that allows to store data in the local storage of the browser.
     */
    function ReplyOfferCtrl ($scope, $mdDialog, LocalStorageService, ProductService, MessageService) {
        var currentOffer = JSON.parse(LocalStorageService.get('currentOffer'))
        $scope.currentProductIndex = 0;
        $scope.offer = currentOffer
        $scope.data_loaded = false;
        
        // This function is called when the template related to the controller inits.
        $scope.init = () => {
            getProductsOffered(currentOffer.products_offered.SS)
            getTargetedProduct(currentOffer.targeted_product.S)
        }
        
        /*
        * This function updates an offer as read in the offers table of the database.
        */
        $scope.updateOfferAsRead = () => {
            OfferService.updateOfferAsRead(currentOffer.offer_id.S, (err, updateOffer) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log(updateOffer)
                    $scope.$apply()
                }
            })
        }
        
        /*
        * This sets in the scope a function that confirms the action of the user
        * wether he/she chooses to accept of decline the offer received.
        */
        $scope.confirmStatus = (event, status) => {
            var title
            var content
            var okButtonText
            // This segment sets the right text for the confirm dialog wether its for accept of decline.
            if (status == 'accepted') {
                title = 'Êtes-vous sûr d\'accepter cette offre?'
                content = 'Si vous acceptez cette offre, un message automatisé sera envoyé à ' + currentOffer.sender_name.S + ' contenant vos coordonnées ' +
                'afin qu\'il/elle puisse vous rejoindre.'
                okButtonText = "Accepter"
            } else {
                title = 'Êtes-vous sûr de refuser cette offre?'
                content = 'Si vous refuser cette offre, un message automatisé sera envoyé à ' + currentOffer.sender_name.S +
                ' afin de l\'avertir que l\'offre fut refusé.'
                okButtonText = "Refuser"
            }
            var confirm = $mdDialog.confirm()
                  .title(title)
                  .textContent(content)
                  .ariaLabel('Lucky day')
                  .targetEvent(event)
                  .ok(okButtonText)
                  .cancel('Annuler');
        
            $mdDialog.show(confirm).then(() => {
                updateOfferStatus(status)
                sendAutomatedMessage(status)
            }, () => {
            });
        };
        
        /*
        * This function sends the automated message after a user
        * approved an offer.
        *
        * @params offerStatus The status of the offer (Accepted/Declined).
        */
        function sendAutomatedMessage (offerStatus) {
            var message = "";
            if (offerStatus == "accepted") {
                message = "Bonjour, ceci est un message pour vous avertir que " +
                    "j'ai accepté votre offre. Répondez à ce message afin que " +
                    "nous puissons échanger nos coordonnées. Vous pouvez également me joindre par " +
                    "courriel à " + currentUser.email + ".";
            } else {
                message = "Bonjour, ceci est un message automatisé pour vous avertir que " +
                    currentUser.name + " a refusé votre offre.";
            }
            const messageObj = {
                message_text: message,
                message_sender_email: currentUser.email,
                message_sender_name: currentUser.name,
                message_sender_picture: currentUser.picture.data.url,
                message_receiver_email: currentOffer.sender.S
            }
            MessageService.addMessage(messageObj, (err, newMessage) => {
                if (err) {
                    console.log(err)
                }
                else {
                    $mdDialog.hide()
                }
            })
        }
        
        /*
        * This function updates the status of an offer in the offers table of the database.
        * It can sets its status to accepted or declined.
        */
        function updateOfferStatus (status) {
            OfferService.updateOfferStatus(currentOffer.offer_id.S , status, (err, updateOffer) => {
                if (err) {
                    console.log(err)
                }
                else {
                    $scope.$apply()
                }
            })
        }
        
        /*
        * This functions queries all the product by ids from products offered and set the data as loaded.
        *
        * @params arrayOfProductId The array containing the id of the products in the offer.
        */
        function getProductsOffered (arrayOfProductId) {
            const productsArray = []
            for (var i = 0; i < arrayOfProductId.length; i++) {
                console.log(arrayOfProductId[i])
                ProductService.queryProduct(arrayOfProductId[i], (err, product) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        productsArray.push(product)
                        if (i == arrayOfProductId.length) {
                            console.log(productsArray)
                            $scope.products_offered = productsArray
                            $scope.data_loaded = true
                        }
                    }
                })
            }
        }
        
        /*
        * This functions queries the targeted product in the offer.
        *
        * @params productId The id of the product.
        */
        function getTargetedProduct (productId) {
            console.log(productId)
            ProductService.queryProduct(productId, (err, product) => {
                if (err) {
                    console.log(err)
                }
                else {
                    $scope.targeted_product = product
                }
            })
        }
        
        /*
         * This function hides the $mdDialog window without any actions.
         */
        $scope.hide = () => {
            $mdDialog.hide()
        }

        /*
         * This function cancels the $mdDialog window with all its proceses.
         */
        $scope.cancel = () => {
            $mdDialog.cancel()
        }

        $scope.setCurrentProductIndex = (index) => {
            $scope.currentProductIndex = index;
        };
    
        $scope.isCurrentProductIndex = (index) => {
            return $scope.currentProductIndex === index;
        };
        
        //function to show next product in the preview box
        $scope.showNextProduct = () => {
            $scope.currentProductIndex = ($scope.currentProductIndex < $scope.products_offered.length - 1) ? ++$scope.currentProductIndex : 0;
        };
        //function to show previous product in the preview box
        $scope.showPreviousProduct = () => {
            $scope.currentProductIndex = ($scope.currentProductIndex > 0) ? --$scope.currentProductIndex : $scope.products_offered.length - 1;
        };

        /*
         * Creates a new message in the database.
         */
        $scope.sendNewMessage = () => {
            const messageObj = {
                message_text: $scope.messageText,
                message_sender_email: currentUser.email,
                message_sender_name: currentUser.name,
                message_sender_picture: currentUser.picture.data.url,
                message_receiver_email: currentOffer.sender.S
            }
            MessageService.addMessage(messageObj, (err, newMessage) => {
                if (err) {
                    console.log(err)
                }
                else {
                    $mdDialog.hide()
                }
            })
        }
    }
}])
