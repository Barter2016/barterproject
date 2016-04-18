angular.module('BarterApp').controller('SignUpCtrl', ['$scope', 'AuthService', 'UtilService', '$window', 'GoogleMapService', function($scope, AuthService, UtilService, $window, GoogleMapService) {

    $scope.postalcode_regex = /^[ABCEGHJKLMNPRSTVWXYabceghjklmnprstvwxy]\d[ABCEGHJKLMNPRSTVWXYabceghjklmnprstvwxy](\s{0,1})\d[ABCEGHJKLMNPRSTVWXYabceghjklmnprstvwxy]\d$/;
    $scope.user = AuthService.getUser()
    $scope.show_loading = false

    $scope.signUp = () => {
        const email = $scope.user.email
        const name = $scope.user.name
        const address = $scope.user.address
        const city = $scope.user.city
        const country = $scope.user.country
        const province = $scope.user.province
        const postalcode = $scope.user.postalcode

        GoogleMapService.doGeocoding(address, (err, data) => {
            
            const coordinates = {
                lat : null,
                lng : null
            }
            
            if (err) {
                console.log(err)
            }
            else {
                if(data.length > 0) {
                    coordinates.lat = data[0].geometry.location.lat()
                    coordinates.lng = data[0].geometry.location.lng()
                }
                
                if (email && name && address && city && country && postalcode) {
                    if (country !== "Canada" || (country === "Canada" && province)) {
                        $scope.user.first_name = $scope.user.name.split(' ')[0]
                        $scope.user.last_name = $scope.user.name.split(' ')[1]
                        $scope.show_loading = true
                        $scope.user.lat = coordinates.lat
                        $scope.user.lng = coordinates.lng
                        console.log("user: " + $scope.user)
                        
                        AuthService.signUp($scope.user, function(err) {
                            $scope.user = null
                            $scope.show_loading = false
                            if (err) {
                                console.log(err)
                            }
                            else {
                                UtilService.goApply('/Home')
                                $window.location.reload()
                            }
                        });
                    }
                }
            }
        })
    }
}]);