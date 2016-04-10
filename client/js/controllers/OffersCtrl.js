angular.module('BarterApp').controller('OffersCtrl', ['$scope', 
'$mdDialog', 
'$mdToast', 
'$mdMedia',
'OfferService',
'LocalStorageService', 
function($scope, $mdDialog, $mdToast, $mdMedia, OfferService, LocalStorageService) {
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
}])
