(function() {
    'use strict';

    angular.module('app').
    directive('itemCard', function() {
        return {
            restrict: "E",
            replace: true,
            templateUrl: 'app/components/addCreativity/itemCards/itemCard.html',
            controller: function($scope, addItemService, allDataService) {
                $scope.allowedDance = [8, 3, 13, 14];
                $scope.allowedArticle = [1, 20, 2];
                $scope.allowedWebsite = [17, 18, 19];
                $scope.alloweduiux = [15, 16];
                $scope.allowedDrawing = [4, 5, 6, 7, 12];
                $scope.allowedMusic = [9, 10, 11];
                $scope.validateUrl = function(url) {
                    var res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
                    if (res == null)
                        return false;
                    else
                        return true;
                };

                $scope.validateYoutube = function(url) {
                    var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
                    if (videoid != null) {
                        return true;
                    } else {
                        return false;
                    }
                }
                $scope.validateVimeo = function(url) {
                    var videoid = url.match(/https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
                    if (videoid != null) {
                        return true;
                    } else {
                        return false;
                    }
                }
                $scope.validateSoundcloud = function(url) {
                    var regexp = /^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/;
                    return url.match(regexp) && url.match(regexp)[2];
                };
                $scope.validateInstagram = function(url) {
                    var regexp = /(https?:\/\/www\.)?instagram\.com(\/p\/\w+\/?)/;
                    return url.match(regexp) && url.match(regexp)[2];
                };

                $scope.setNoembed = function(url, index) {
                    allDataService.noembedJson(url)
                        .then(function(data) {
                            $scope.creativity.items[index].noembed = data;
                            if ($scope.title == '') {
                                $scope.title = $scope.creativity.items[index].noembed.title;
                            }
                        });
                };
            }
        };
    });

})();
