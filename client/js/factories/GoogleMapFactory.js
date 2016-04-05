angular.module('BarterApp').factory('GoogleMapService', function() {
    
    const googleMapServce = {
        doGeocoding : (address, callback) => {
            console.log(address)
            if(!address) {
                callback(new Error("The address can not be null"), null, null)
            }
            else {
                const geocoder = new google.maps.Geocoder()
                geocoder.geocode({ address: address }, (results, status) =>{
                    const coordonates = results[0].geometry.location
                    console.log(results)
                    console.log(coordonates)
                    callback(null, results)
                })
            }
        }            
    }
    
    return googleMapServce
    
});