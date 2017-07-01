'use strict';

(function() {

    angular
        .module('app')
        .controller('CreativityController', [
            '$scope',
            'tokenService',
            '$sce',
            '$state',
            '$filter',
            '$rootScope',
            'creativityCategories',
            CreativityController
        ]);

    function CreativityController($scope, tokenService, $sce, $state, $filter, $rootScope, creativityCategories) {
        $scope.creativityLoading = false;
        $rootScope.currentMenu = 'Creativity';
        $scope.moreItems = true;
        $scope.nonFinalContents = [];
        $scope.finalContents = [];
        $scope.finalContentsCopy = [];
        $rootScope.currentPageBackground = $rootScope.gray;
        $rootScope.title = "Creativity";
        $scope.types = creativityCategories.types;
        $scope.typesByID = creativityCategories.typesByID;
        $scope.mediaTypes = [4, 5, 6, 7, 12, 15, 16];
        $scope.contents = [];
        var cardObject = {};
        $scope.contentDetails = {
            "limit": 3,
            "offset": 0,
            "filters": []
        };

        //FILTERS SHIT START
            
            console.log('filters called');
            $scope.selected = [];
            $scope.filterInBetween = 0;
            $scope.filterShow = 0;
            $scope.selectedCategories = [];
            $scope.filterToggle = function() {
                $scope.filterShow = !$scope.filterShow;
            };

            $scope.exists = function(item) {
                if ($scope.selectedCategories.length == 0) {
                    return true;
                } else {

                    return $scope.selectedCategories.indexOf(item) > -1;
                }
            };
            var deleteList = [];
            $scope.toggle = function(item, list) {
                var idx = $scope.selectedCategories.indexOf(item);
                if (idx > -1) {
                    $scope.selectedCategories.splice(idx, 1);
                    deleteList.splice(idx, 1);
                    $scope.contentDetails.filters = deleteList;
                    if ($scope.filterInBetween) {
                        $scope.creativityLoading = false;
                        $scope.moreItems = true;
                        $scope.contentDetails.offset = 0;
                        $scope.filterInBetween = 0;
                        $scope.finalContentsCopy = [];
                        $scope.finalContents = [];
                        $scope.myPagingFunction();
                    } else {
                        $scope.finalContents = $scope.finalContentsCopy.filter(function(obj) {
                            console.log(obj);
                            return deleteList.indexOf(obj.content_type) != -1;
                        });
                    }
                } else {
                    $scope.selectedCategories.push(item);
                    deleteList.push(item.id);
                    $scope.contentDetails.filters = deleteList;
                    if ($scope.filterInBetween) {
                        $scope.creativityLoading = false;
                        $scope.moreItems = true;
                        $scope.contentDetails.offset = 0;
                        $scope.filterInBetween = 0;
                        $scope.finalContentsCopy = [];
                        $scope.finalContents = [];
                        $scope.myPagingFunction();
                    } else {

                        $scope.finalContents = $scope.finalContentsCopy.filter(function(obj) {
                            console.log(obj);
                            return deleteList.indexOf(obj.content_type) != -1;
                        });
                    }

                    $scope.buttonClass = 'md-primary md-raised';
                }
                item.intrested = !item.intrested;
                $scope.selectedCategories = $scope.selectedCategories;
            };
        // FILTERS SHIT END
        $scope.myPagingFunction = function() {
            if ($scope.creativityLoading == false && $scope.moreItems == true) {
                $scope.creativityLoading = true;
                if ($scope.contentDetails.filters.length) {
                    $scope.filterInBetween = 1;
                }
                tokenService.post("contentsList", $scope.contentDetails)
                    .then(function(tableData) {
                        // console.log(tableData);
                        $scope.creativityLoading = false;
                        if (tableData.data.length < 3) {
                            $scope.moreItems = false;
                        }

                        $scope.nonFinalContents = [];
                        
                        $scope.contents = [];
                        $scope.contents = tableData.data;

                        // $scope.contents.forEach(function(content) {
                        //     cardObject = {};

                        //     cardObject.Actions = content.Actions;
                        //     cardObject.Tags = content.Tags;
                        //     cardObject.created = content.created;
                        //     // cardObject.created.at = Date.parse(cardObject.created.at.replace('-', '/', 'g')); //replace mysql date to js date format
                        //     cardObject.id = content.id;
                        //     cardObject.title = $sce.trustAsHtml(content.title);
                        //     cardObject.content = content.content;
                        //     $scope.types.some(function(obj) {
                        //         if (obj.id == cardObject.content.type) {
                        //             cardObject.category = obj.title;
                        //             cardObject.categoryId = obj.id;
                        //         } else {
                        //             return;
                        //         }
                        //     });
                        //     cardObject.Items = content.Items;
                        //     cardObject.links = content.links;
                        //     cardObject.total = content.links;
                        //     content.Items.data.forEach(function(item) {
                        //         if (item.type == 'text') {
                        //             cardObject.description = item.description;
                        //             cardObject.description = $sce.trustAsHtml(cardObject.description);
                        //         } else if ((item.type == 'cover' && !cardObject.type)) {
                        //             cardObject.type = item.type;
                        //             cardObject.url = item.image;
                        //         } else if (item.type == 'soundcloud') {
                        //             cardObject.type = item.type;
                        //             item.url = "https://w.soundcloud.com/player/?url=" + item.url;
                        //             cardObject.url = $sce.trustAsResourceUrl(item.url);
                        //         } else if ((item.type == 'youtube' || item.type == 'vimeo') && !cardObject.type) {
                        //             cardObject.type = item.type;
                        //             cardObject.url = $sce.trustAsResourceUrl(item.url);
                        //         } else if (((item.type == 'cover') || (item.type == 'image')) && !cardObject.type) {
                        //             cardObject.type = item.type;
                        //             cardObject.url = item.image;
                        //         }
                        //     });
                        //     if (cardObject.type != 'cover' || cardObject.type != 'soundcloud' || cardObject.type != 'youtube') {
                        //         cardObject.description = $filter('limitTo')(cardObject.description, 90, 0)
                        //     } else {
                        //         cardObject.description = $filter('limitTo')(cardObject.description, 110, 0)

                        //     }
                        //     $scope.nonFinalContents.push(cardObject);
                        //     content = {};
                        //     $scope.creativityLoading = false;

                        // });
                        $scope.creativityLoading = false;
                        
                        // $scope.finalContents = $scope.finalContents.concat($scope.nonFinalContents);
                        // $scope.finalContentsCopy = $scope.finalContentsCopy.concat($scope.nonFinalContents);
                        $scope.finalContents = $scope.finalContents.concat($scope.contents);
                        $scope.finalContentsCopy = $scope.finalContentsCopy.concat($scope.contents);

                        $scope.contentDetails.offset += 3;
                        $scope.myPagingFunction();
                    });

            }
        };


    }
}());
