'use strict';

(function() {

    angular
        .module('app')
        .controller('CreativityController', [
            '$scope',
            'tokenService',
            '$mdDialog',
            '$sce',
            '$state',
            '$filter',
            CreativityController
        ]);

    function CreativityController($scope, tokenService, $mdDialog, $sce, $state, $filter) {
        var vm = this;
        $scope.liked = false;
        $scope.loading = false;
        $scope.offset = 0;
        $scope.moreItems = true;
        $scope.finalContents = [];

        $scope.contents = [];
        $scope.clicked = function(item) {
            console.log(item);
            $state.go('home.singleContent', { contentId: item });

        };
        var cardObject = {};
        // tokenService.get("contents")
        //     .then(function(tableData) {
        //         $scope.contents = $scope.contents.concat(tableData.data);
        //         $scope.contents.forEach(function(content) {
        //             cardObject = {};
        //             cardObject.Actions = content.Actions;
        //             cardObject.Tags = content.Tags;
        //             cardObject.created = content.created;
        //             cardObject.created.at = Date.parse(cardObject.created.at.replace('-', '/', 'g')); //replace mysql date to js date format
        //             cardObject.id = content.id;
        //             cardObject.title = $sce.trustAsHtml(content.title);
        //             cardObject.links = content.links;
        //             cardObject.total = content.links;
        //             content.Items.data.forEach(function(item) {
        //                 if (item.type == 'text') {
        //                     cardObject.description = $filter('limitTo')(item.description, 110, 0)
        //                     cardObject.description = $sce.trustAsHtml(cardObject.description);
        //                 } else if ((item.type == 'cover' && !cardObject.type)) {
        //                     cardObject.type = item.type;
        //                     cardObject.url = item.image;
        //                 } else if ((item.type == 'youtube' || item.type == 'soundcloud' || item.type == 'vimeo') && !cardObject.type) {
        //                     cardObject.type = item.type;
        //                     cardObject.url = $sce.trustAsResourceUrl(item.embed.url);
        //                 } else if (((item.type == 'cover') || (item.type == 'image')) && !cardObject.type) {
        //                     cardObject.type = item.type;
        //                     cardObject.url = item.image;
        //                 }
        //             });
        //             $scope.finalContents.push(cardObject);
        //             content = {};
        //             $scope.loading = true;
        //         });
        //         $scope.contents = [];
        //     });
        $scope.myPagingFunction = function() {
            console.log('paging called');
            if ($scope.loading == false && $scope.moreItems == true) {
                $scope.loading = true;
                tokenService.get("contents?offset=" + $scope.offset)
                    .then(function(tableData) {
                        console.log(tableData);
                        $scope.loading = false;
                        if (tableData.data.length < 3) {
                            $scope.moreItems = false;
                        }
                        $scope.contents = $scope.contents.concat(tableData.data);
                        $scope.contents.forEach(function(content) {
                            cardObject = {};
                            cardObject.Actions = content.Actions;
                            cardObject.Tags = content.Tags;
                            cardObject.created = content.created;
                            cardObject.created.at = Date.parse(cardObject.created.at.replace('-', '/', 'g')); //replace mysql date to js date format
                            cardObject.id = content.id;
                            cardObject.title = $sce.trustAsHtml(content.title);
                            cardObject.links = content.links;
                            cardObject.total = content.links;
                            content.Items.data.forEach(function(item) {
                                if (item.type == 'text') {
                                    cardObject.description = $filter('limitTo')(item.description, 110, 0)
                                    cardObject.description = $sce.trustAsHtml(cardObject.description);
                                } else if ((item.type == 'cover' && !cardObject.type)) {
                                    cardObject.type = item.type;
                                    cardObject.url = item.image;
                                } else if ((item.type == 'youtube' || item.type == 'soundcloud' || item.type == 'vimeo') && !cardObject.type) {
                                    cardObject.type = item.type;
                                    cardObject.url = $sce.trustAsResourceUrl(item.embed.url);
                                } else if (((item.type == 'cover') || (item.type == 'image')) && !cardObject.type) {
                                    cardObject.type = item.type;
                                    cardObject.url = item.image;
                                }
                            });
                            $scope.finalContents.push(cardObject);
                            content = {};
                            $scope.loading = true;
                        });
                        $scope.offset = tableData.meta.offset;
                        console.log($scope.offset);
                    });
            }
        };

        $scope.toggleLike = function(contentId) {
            console.log(contentId);
            vm.liked = !vm.liked;
        }

        $scope.bookmark = function(content, index) {
            $scope.finalContents[index].Actions.Bookmarked.status = !$scope.finalContents[index].Actions.Bookmarked.status;
            if ($scope.finalContents[index].Actions.Bookmarked.status) {
                $scope.finalContents[index].Actions.Bookmarked.total += 1;
                tokenService.post('bookmarkContent/' + content.id).then(function(result) {
                    if (result.status != 'error') {
                        console.log(result.status);
                    } else {
                        console.log(result);
                    }
                });
            } else {
                $scope.finalContents[index].Actions.Bookmarked.total -= 1;
                tokenService.delete('bookmarkContent/' + content.id, '').then(function(result) {
                    if (result.status != 'error') {
                        console.log(result.status);
                    } else {
                        console.log(result);
                    }
                });
            }
        }
        $scope.heart = function(content, $index) {
            $scope.finalContents[$index].Actions.Appriciate.status = !$scope.finalContents[$index].Actions.Appriciate.status;
            if ($scope.finalContents[$index].Actions.Appriciate.status) {
                $scope.finalContents[$index].Actions.Appriciate.total += 1;
                tokenService.post('appreciateContent/' + content.id).then(function(result) {

                    console.log('post request');
                    if (result.status != 'error') {
                        console.log(result.status);
                    } else {
                        console.log(result);
                    }
                });
            } else {
                $scope.finalContents[$index].Actions.Appriciate.total -= 1;

                tokenService.delete('appreciateContent/' + content.id, '').then(function(result) {
                    console.log('post request');
                    if (result.status != 'error') {
                        console.log(result.status);
                    } else {
                        console.log(result);
                    }
                });
            }
        }
        $scope.openUrlAdd = function(ev) {
            $mdDialog.show({
                controller: 'AddUrlController',
                templateUrl: 'app/views/partials/addUrl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: true // Only for -xs, -sm breakpoints.
            })
        };


    }
}());
