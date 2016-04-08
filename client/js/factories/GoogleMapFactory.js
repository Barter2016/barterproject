angular.module('BarterApp').factory('GoogleMapService', function() {

    function toRadian(number) {
        return number * Math.PI / 180;
    }

    const googleMapServce = {

        doGeocoding: (address, callback) => {
            console.log(address)
            if (!address) {
                callback(new Error("The address can not be null"), null, null)
            }
            else {
                const geocoder = new google.maps.Geocoder()
                geocoder.geocode({
                    address: address
                }, (results, status) => {
                    callback(null, results)
                })
            }
        },

        /**
         * Get the distance between two coordonates.
         */
        getDistance: (p1, p2, callback) => {
            try {
                const earthMeanRadius = 6378137 // Earth’s mean radius in meter
                const dLat = toRadian(p2.lat - p1.lat)
                const dLong = toRadian(p2.lng - p1.lng)

                const a =
                    Math.sin(dLat / 2) 
                    * Math.sin(dLat / 2) 
                    + Math.cos(toRadian(p1.lat)) 
                    * Math.cos(toRadian(p2.lat)) 
                    * Math.sin(dLong / 2) 
                    * Math.sin(dLong / 2)

                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
                const distance = (earthMeanRadius * c) / 1000 // the distance in Km

                callback(null, distance)
            }
            catch (err) {
                callback(err, null)
            }
        }
    }

    return googleMapServce

});