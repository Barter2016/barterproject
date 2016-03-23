angular.module('BarterApp').controller('CatalogueCtrl', ['$scope','GetService','AddService','ProductService','CategoryService','LocalStorageService', function($scope, GetService, AddService,ProductService,CategoryService,LocalStorageService) {
    //const multer  =   require('multer');
    const user = LocalStorageService.getObject('user');


    GetService.scanProductsByUser(user.email,(err, products) => {
        if(err) {
            console.log(err)
        }
        else {
            $scope.products = products
            console.log($scope.products)
            $scope.$apply()
        }
    })
    
    GetService.scanAllCategories((err, categories) => {
        if(err) {
            console.log(err)
        }
        else {
            $scope.categories = categories
            console.log($scope.categories)
            $scope.$apply()
        }
    })
    
    $scope.test = (file) => {
        console.log(file)
    }
    
    $scope.addProduct = function(new_product){
        
        //hardcoder les tags pour l'instants
        new_product.product_tags = "product";
        
        new_product.user_email = user.email;

        //var s3 = new AWS.S3({computeChecksums: true}); // this is the default setting
        //var params = {Bucket: 'barter2016', Key: 'user_image/bob.txt', Body: 'EXPECTED CONTENTS'};
        //var url = s3.getSignedUrl('putObject', params);
        //console.log("The URL is", url);
        
        const s3bucket = new AWS.S3({params: {Bucket: 'barter2016'}});
        s3bucket.createBucket(function() {
          var params = {Key: 'user_image/bob.txt', Body: 'Hello!'};
          s3bucket.upload(params, function(err, data) {
            if (err) {
              console.log("Error uploading data: ", err);
            } else {
              console.log("Successfully uploaded data to barter2016/user_image/bob.txt");
            }
          });
        });

        AddService.addProduct(new_product, (err, data) => {
            if(err) {
                console.log(err)
            }
            else {
                alert("Le produit " + new_product.product_name + "a été créé avec succès");
            }
        })
    }
}]);





