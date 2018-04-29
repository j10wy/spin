angular.module('app.controllers', [])

  .controller('homeCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams) {

      function getTimeRemaining(endtime) {
        var t = Date.parse(endtime) - Date.parse(new Date());
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        var days = Math.floor(t / (1000 * 60 * 60 * 24));
        return {
          'total': t,
          'days': days,
          'hours': hours,
          'minutes': minutes,
          'seconds': seconds
        };
      }

      function initializeClock(id, endtime) {
        var clock = document.getElementById(id);
        var daysSpan = clock.querySelector('.days');
        var hoursSpan = clock.querySelector('.hours');
        var minutesSpan = clock.querySelector('.minutes');
        var secondsSpan = clock.querySelector('.seconds');

        var today = new Date();
        var pastDeadline = today > deadline ? 'past the deadline' : 'good to go!';
        console.log('Deadline: You are ', pastDeadline)

        function updateClock() {
          var t = getTimeRemaining(endtime);

          daysSpan.innerHTML = t.days;
          hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
          minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
          secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

          if (t.total <= 0) {
            clearInterval(timeinterval);
          }
        }

        updateClock();
        var timeinterval = setInterval(updateClock, 1000);
      }

      var deadline = new Date('June 3, 2018 07:00:00');
      initializeClock('clockdiv', deadline);
    }
  ])

  .controller('menuCtrl', function($scope, $rootScope, $state, $stateParams, $http, $ionicSideMenuDelegate) {

    $scope.logout = function() {

      $http({
        method: 'POST',
        url: $rootScope.luminate.uri + 'CRConsAPI',
        data: 'method=logout' + $rootScope.luminate.postdata,
        headers: $rootScope.luminate.header
      }).then(function() {

        $rootScope.luminate.loggedIn = false;
        $rootScope.luminate.cons_id = '';
        $rootScope.luminate.token = '';
        $rootScope.luminate.tr_info = {};
        $rootScope.luminate.bikeParking = false;
        $rootScope.luminate.groups = {
          pom: 'NO RSVP',
          med_form: false,
          incentive_pickup: false
        };

        $ionicSideMenuDelegate.toggleLeft();
        $state.go('menu.home');
      }, function() {
        console.log('Log out failed.');
      });
    }
  })

  .controller('loginCtrl', function($scope, $ionicPopup, $state, $stateParams, $rootScope, $http, $log, loginService, constituentService, teamRaiserService, tentMateService, participantProgress, constituentGroupsService, interactionService) {

    // Form data for the login modal
    $scope.loginData = {};
    $scope.loginData.username = window.localStorage.username || '';
    $scope.loginData.password = window.localStorage.password || '';
    $scope.savePassword = true;

    // Perform the login action when the user submits the login form
    $scope.login = function() {

      //LOGIN REQUEST
      $http({
        method: 'POST',
        url: $rootScope.luminate.uri + 'CRConsAPI',
        data: 'method=login' + $rootScope.luminate.postdata + '&user_name=' + $scope.loginData.username + '&password=' + $scope.loginData.password,
        headers: $rootScope.luminate.header
      })
        .success(function(loginResponseData) {
          //Store the login Success response in the response variable
          var response = loginResponseData.loginResponse;

          //Store the participant's un/pw entry in the $rootScope and localStorage
          $rootScope.luminate.username = $scope.loginData.username;
          $rootScope.luminate.password = $scope.loginData.password;
          window.localStorage.username = $scope.loginData.username;
          window.localStorage.password = $scope.loginData.password;

          //Store the participant's constituent ID and login token as their own objects
          $rootScope.luminate.cons_id = response.cons_id;
          $rootScope.luminate.token = response.token;

          $rootScope.luminate.loggedIn = true;
        })
        .error(function(errorResponse) {
          console.log('Log in error:', errorResponse);
          $rootScope.luminate.loggedIn = false;
          $ionicPopup.alert({
            title: 'Alert!',
            template: 'Username or password is incorrect.'
          });
        })
        .then(function() {

          //Get Constituent Profile
          constituentService.getConsRecord();
          //Get TeamRaiser Registration
          teamRaiserService.getTeamRaiserRegistration();
          //Get Participant Tent Mate Information
          tentMateService.getTentMate();
          //Participant Progress
          participantProgress.getProgress();
          //Constituent Groups
          constituentGroupsService.getGroups();

        }).then(function() {
        setTimeout(function() {
          $state.go('menu.home');
        }, 500);

        interactionService.logInteraction('My ALC Spin login', '*** Test ***\nLogged in with My ALC Spin app');
      });

    };

  })

  .controller('checkInCtrl', function($scope, $stateParams) {})

  .controller('orientationDayCtrl', function($scope, $stateParams, $rootScope) {

    JsBarcode('#alc-num-barcode', $rootScope.luminate.tr_info.raceNumber, {
      width: 3
    });

  })

  .controller('incentivesCtrl', function($scope, $rootScope, $stateParams, $http, incentivesService) {

    incentivesService.getIncentives();

    $scope.incentiveRefresh = function() {
      $scope.getIncentives();
      $scope.$broadcast('scroll.refreshComplete');
    }

  })

  .controller('roadiesCtrl', function($scope, $stateParams) {})

  .controller('bikeLocationCtrl', function($scope, $rootScope, $stateParams, $http) {

    var sheetsu = 'https://sheetsu.com/apis/v1.0/0e27b4365f4a/search?bike_number=' + $rootScope.luminate.tr_info.raceNumber;

    $scope.getBikeInfo = function() {

      $http({
        method: 'GET',
        url: sheetsu
      }).then(function successCallback(bikeInfoResponse) {

        // Bike Location data
        var bikeInfo = bikeInfoResponse.data[0];
        console.log('Bike info:', bikeInfo);

        // Update Scope
        $scope.bike_rack = bikeInfo.bike_rack;
        console.log('rack', $scope.bike_rack)
        $scope.bike_scan_date = bikeInfo.date;
        $scope.bike_scan_time = bikeInfo.time;

      }, function errorCallback(response) {
        console.log('Sheetsu Failure:', response);
      });

    }

    $scope.getBikeInfo();
    $scope.bikeInfoRefresh = function() {
      $scope.getBikeInfo();
      $scope.$broadcast('scroll.refreshComplete');
    };

  })
