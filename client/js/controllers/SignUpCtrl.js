angular.module('BarterApp').controller('SignUpCtrl', ['$scope','AuthService', 'UtilService', '$window', 'GoogleMapService',function($scope, AuthService, UtilService, $window, GoogleMapService) {
    
    $scope.postalcode_regex = /^[ABCEGHJKLMNPRSTVWXYabceghjklmnprstvwxy]\d[ABCEGHJKLMNPRSTVWXYabceghjklmnprstvwxy](\s{0,1})\d[ABCEGHJKLMNPRSTVWXYabceghjklmnprstvwxy]\d$/;
    $scope.user = AuthService.getUser()
    $scope.show_loading = false
    $scope.showMap = false
    
    function showGoogleMap(coordonates) {
        
        var mapDiv = document.getElementById('map');
        var map = new google.maps.Map(mapDiv, {
          center: {
              lat: coordonates.lat, 
              lng: coordonates.lng
          },
          zoom: 8
        })
        
        const marker = new google.maps.Marker({
            position: coordonates,
            map: map,
            draggable: true
        }) 
        
        marker.addListener('dragend', () => {
            console.log(marker.position.lat())
            console.log(marker.position.lng())
        })
    }
    
    $scope.signUp = () => {
        // const email = $scope.user.email
        // const name = $scope.user.name
        // const address = $scope.user.address
        // const city = $scope.user.city
        // const country = $scope.user.country
        // const province = $scope.user.province
        // const postalcode = $scope.user.postalcode
        
        const address = "3872, la vérendrye"
        const address2 = "2125, boulvard edward-montpetit"
        const city = "Laval"
        const country = "Canada"
        const province = "QC"
        const postalCode = "H7E1K8"
        
        GoogleMapService.doGeocoding(address, (err, data) => {
            const coordonates = {
                 lat: data[0].geometry.location.lat(),
                 lng: data[0].geometry.location.lng()
            }
            showGoogleMap(coordonates)
        })
        
        // if (email && name && address && city && country && postalcode) {
        //     if (country !== "Canada" || (country === "Canada" && province)) {
        //         $scope.user.first_name = $scope.user.name.split(' ')[0]
        //         $scope.user.last_name = $scope.user.name.split(' ')[1]
        //         $scope.show_loading = true
        //         AuthService.signUp($scope.user, function(err) {
        //             $scope.user = null
        //             $scope.show_loading = false
        //             if (err) {
        //                 console.log(err)
        //             }
        //             else {
        //                 UtilService.goApply('/Home')
        //                 $window.location.reload()
        //             }
        //         });
        //     }
        // }
        
    }
    
}]);