(function() {
    'use strict';

    angular.module('app').
    directive('addDance', function() {
        return {
            restrict: "E",
            replace: true,
            templateUrl: 'app/components/addCreativity/itemCards/addDance.html',
            controller: function($scope, addItemService, $sce, $rootScope) {
                //Define Variables
                $scope.videoAdded = false;
                $scope.danceAdded = false;
                $scope.enterUrl = true;
                //End Defining variables

                $scope.checkVideo = function() {
                    console.log('$scope.danceAdded');
                    if ($scope.creativity.items[0] == undefined || $scope.videoAdded) {
                        $scope.videoAdded = false;
                        $scope.danceAdded = false;
                        $scope.url = '';
                        $scope.$emit("publishable", $scope.danceAdded);
                    } else {
                        $scope.videoAdded = true;
                        $scope.danceAdded = true;
                        $scope.url = '';
                        $scope.$emit("publishable", $scope.danceAdded);

                    }
                }
                $scope.removeDance = function() {
                    $scope.creativity.items.pop();
                    $scope.videoAdded = false;
                    $scope.danceAdded = false;
                    $scope.$emit("publishable", $scope.danceAdded);
                }
                $scope.addDanceVideo = function(url) {
                    if (addItemService.validateUrl(url)) {
                        if ($scope.creativity.items.length > 1) {
                            $scope.creativity.items.pop();
                        }
                        var promise = addItemService.iframely(url, "embed");

                        promise.then(function(greeting) {
                            $scope.checkVideo();
                        }, function(err) {
                            console.log("Retrying");
                            promise.then(function(greeting) {
                                $scope.checkVideo();
                            }, function(err) {
                                $scope.error = err.message;
                            });
                        });
                    } else {
                        $scope.error = "Enter a valid url.";
                    }
                };
            }
        };
    });

})();
