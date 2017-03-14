(function() {

    angular
        .module('app')
        .controller('SignUpController', [

            '$scope', '$timeout', 'loginData', '$rootScope', '$localStorage', '$state', 'collegesListService', 'tokenService', '$auth',
            SignUpController
        ]);

    function SignUpController($scope, $timeout, loginData, $rootScope, $localStorage, $state, collegesListService, tokenService, $auth) {
        var vm = this;
        $scope.loading = false;
        $scope.querySearch = querySearch;
        $scope.signUp = {};
        vm.tags = [];
        if (localStorage.getItem('id_token') != null) {
            $state.go("home.dashboard");
        }
        $scope.skills = loadSkills();
        $scope.signUp.collegeId = 0;
        tokenService.get("colleges").then(function(colleges) {
            $scope.colleges = colleges;
        });
        $scope.items1 = [
            { 'title': 'Articles', 'id': 1, 'intrested': false },
            { 'title': 'Poetry', 'id': 1, 'intrested': false },
            { 'title': 'Drama', 'id': 1, 'intrested': false },
            { 'title': 'Painting', 'id': 1, 'intrested': false }
        ];
        $scope.items2 = [
            { 'title': 'Sketching', 'id': 1, 'intrested': false },
            { 'title': 'Manga', 'id': 1, 'intrested': false },
            { 'title': 'Craft', 'id': 1, 'intrested': false },
            { 'title': 'Song Covers', 'id': 1, 'intrested': false },
            { 'title': 'Instrumental', 'id': 1, 'intrested': false }

        ];
        $scope.items3 = [
            { 'title': 'Music Mixing', 'id': 1, 'intrested': false },
            { 'title': 'Photography', 'id': 1, 'intrested': false },
            { 'title': 'Apps', 'id': 1, 'intrested': false },
            { 'title': 'Apps', 'id': 1, 'intrested': false }

        ];
        $scope.items4 = [
            { 'title': 'Apps', 'id': 1, 'intrested': false },
            { 'title': 'Apps', 'id': 1, 'intrested': false },
            { 'title': 'Film and Video', 'id': 1, 'intrested': false },
            { 'title': 'Animation', 'id': 1, 'intrested': false },
            { 'title': 'Graphics', 'id': 1, 'intrested': false }
        ];
        $scope.items5 = [

            { 'title': 'UI and UX', 'id': 1, 'intrested': false },
            { 'title': 'Webites', 'id': 1, 'intrested': false },
            { 'title': 'Apps', 'id': 1, 'intrested': false }
        ];
        // $scope.sports = [
        //     { 'title': 'Football', 'intrested': false },
        //     { 'title': 'Cricket', 'intrested': false },
        //     { 'title': 'Basketball', 'intrested': false },
        //     { 'title': 'Volleyball', 'intrested': false },
        //     { 'title': 'Badminton', 'intrested': false },

        //     { 'title': 'Chess', 'intrested': false }
        // ];
        // $scope.cultural = [
        //     { 'title': 'Dancing', 'intrested': false },
        //     { 'title': 'Acting', 'intrested': false },
        //     { 'title': 'Debating', 'intrested': false },
        //     { 'title': 'Film Making', 'intrested': false },

        //     { 'title': 'Music', 'intrested': false },
        //     { 'title': 'Photography', 'intrested': false }
        // ];
        $scope.transformChip = transformChip;

        function transformChip(chip) {
            // If it is an object, it's already a known chip
            if (angular.isObject(chip)) {
                return chip;
            }
            // Otherwise, create a new one
            return { name: chip }
        }

        function querySearch(query) {
            console.log('query funciton called');
            var results = query ? $scope.skills.filter(createFilterFor(query)) : [];
            return results;
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(skill) {
                return (skill._lowername.indexOf(lowercaseQuery) === 0);
                // (skill._lowertype.indexOf(lowercaseQuery) === 0);
            };

        }

        $scope.selectedSkills = [{
            'name': 'Broccoli'
        }, {
            'name': 'Cabbage'
        }];

        function loadSkills() {
            var skills = [{
                'name': 'Broccoli'
            }, {
                'name': 'Cabbage'
            }, {
                'name': 'Carrot'
            }, {
                'name': 'Lettuce'
            }, {
                'name': 'Spinach'
            }];

            return skills.map(function(veg) {
                veg._lowername = veg.name.toLowerCase();
                return veg;
            });
        };


        $scope.signUp = {};

        $scope.authenticate = function(provider) {
            $scope.loading = true;
            $auth.authenticate(provider).then(function(response) {
                    $scope.signUp.token = response.access_token;
                    $scope.signUp.type = provider;
                    $scope.signUp.skills = $scope.selectedSkills;
                    $scope.signUp.intrests = $scope.interests;
                    $scope.signUp.college_id = $scope.college;
                    $scope.signUp.college_id = 1;
                    console.log("then");
                    tokenService.post("signup", $scope.signUp)
                        .then(function(abc) {
                            console.log(abc);
                            localStorage.setItem('id_token', abc.token);
  //                          localStorage.setItem('username', abc.student.username);
    //                        localStorage.setItem('college_id', abc.student.college_id);
      //                      localStorage.setItem('image', abc.student.image);
                            $rootScope.token = abc.token;
                            $rootScope.image = abc.image;
                            $state.go("home.dashboard");
                            return;
                        }).catch(function(abc) {
                            console.log(abc);
                            localStorage.setItem('id_token', abc.token);
                            $scope.problem=abc.status;
                            $rootScope.token = abc.token;
                             $state.go("home.dashboard");
                            return;

                        });

                })
                .catch(function(response) {
                    console.log("catch");

                    $scope.signUp.token = response.access_token;
                    $scope.signUp.type = provider;
                    $scope.signUp.skills = $scope.selectedSkills;
                    $scope.signUp.intrests = $scope.interests;
                    $scope.signUp.college_id = $scope.college;
                    $scope.signUp.college_id = 1;
                    tokenService.post("signup", $scope.signUp)
                        .then(function(abc) {
                            localStorage.setItem('id_token', abc.token);
                            $rootScope.token = abc.token;
                            //                            $state.go("home.dashboard");
                            return;
                        }).catch(function(abc) {
                            $scope.loading = false;

                        });
                });

        };
        $scope.selected = [];
        $scope.interests = [];

        $scope.toggle = function(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            } else {
                list.push(item);
                $scope.buttonClass = 'md-primary md-raised';
            }
            item.intrested = !item.intrested;
            $scope.interests = list;
            $scope.continue = ($scope.interests.length > 3);
        };
        $scope.exists = function(item, list) {
            return list.indexOf(item) > -1;
        };
        $scope.currentState = 1;

        $rootScope.$on('event:social-sign-in-success', function(event, response) {
            // console.log("Social sign in success")
            // console.log(userDetails);
                        $scope.loading = true;

            console.log(event);
            console.log(response);
            $scope.signUp.token = response.token;
            $scope.signUp.type = "google";
            $scope.signUp.skills = $scope.selectedSkills;
            $scope.signUp.intrests = $scope.interests;
            $scope.signUp.college_id = $scope.college;
            $scope.signUp.college_id = 1;

            console.log($scope.signUp);
            tokenService.post("signup", $scope.signUp)
                .then(function(abc) {
                    console.log(abc);
                    localStorage.setItem('id_token', abc.token);
                    $rootScope.token = abc.token;
                    //      $state.go("home.dashboard");
                    return;

                }).catch(function(abc) {
                                $scope.loading = false;
                                $scope.problem="Could not sign you up try again later.";

                });

            // $scope.$apply(function() {

            //     $scope.currentState = 2;
            // })
            $timeout(function() {
                //$scope.currentState = 2;
                // $scope.someData = someData;
            }, 0);
        })


    }
})();
