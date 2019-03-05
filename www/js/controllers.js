// @ts-ignore
angular
  .module("app.controllers", [])

  .controller("homeCtrl", [
    "$scope",
    "$stateParams",
    // @ts-ignore
    function($scope, $stateParams) {
      var deadline = new Date("June 3, 2019 7:00:00");

      function getTimeRemaining(endtime) {
        var now = new Date();
        // @ts-ignore
        var t = Date.parse(endtime) - Date.parse(new Date());
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        var days = Math.floor(t / (1000 * 60 * 60 * 24));
        return {
          total: t,
          days: days,
          hours: hours,
          minutes: minutes,
          seconds: seconds
        };
      }

      function initializeClock(id, endtime) {
        var clock = document.getElementById(id);
        var daysSpan = clock.querySelector(".days");
        var hoursSpan = clock.querySelector(".hours");
        var minutesSpan = clock.querySelector(".minutes");
        var secondsSpan = clock.querySelector(".seconds");
        var today = new Date();

        function updateClock() {
          var t = getTimeRemaining(endtime);
          // @ts-ignore
          daysSpan.innerHTML = t.days;
          hoursSpan.innerHTML = ("0" + t.hours).slice(-2);
          minutesSpan.innerHTML = ("0" + t.minutes).slice(-2);
          secondsSpan.innerHTML = ("0" + t.seconds).slice(-2);

          if (today > deadline) {
            // @ts-ignore
            daysSpan.innerHTML = 0;
            // @ts-ignore
            hoursSpan.innerHTML = 0;
            // @ts-ignore
            minutesSpan.innerHTML = 0;
            // @ts-ignore
            secondsSpan.innerHTML = 0;
          }

          if (t.total <= 0) {
            clearInterval(timeinterval);
          }
        }

        updateClock();
        var timeinterval = setInterval(updateClock, 1000);
      }
      initializeClock("clockdiv", deadline);
    }
  ])

  .controller("menuCtrl", function(
    $scope,
    $rootScope,
    $state,
    // @ts-ignore
    $stateParams,
    $http,
    $ionicSideMenuDelegate
  ) {
    $scope.logout = function() {
      $http({
        method: "POST",
        url: $rootScope.luminate.uri + "CRConsAPI",
        data: "method=logout" + $rootScope.luminate.postdata,
        headers: $rootScope.luminate.header
      }).then(
        function() {
          $rootScope.luminate.loggedIn = false;
          $rootScope.luminate.cons_id = "";
          $rootScope.luminate.token = "";
          $rootScope.luminate.tr_info = {};
          $rootScope.luminate.bikeParking = false;
          $rootScope.luminate.groups = {
            pom: "NO RSVP",
            med_form: false,
            incentive_pickup: false
          };

          $ionicSideMenuDelegate.toggleLeft();
          $state.go("menu.home");
        },
        function() {
          console.log("Log out failed.");
        }
      );
    };
  })

  .controller("loginCtrl", function(
    $scope,
    $ionicPopup,
    $state,
    // @ts-ignore
    $stateParams,
    $rootScope,
    $http,
    // @ts-ignore
    $log,
    // @ts-ignore
    loginService,
    constituentService,
    teamRaiserService,
    tentMateService,
    participantProgress,
    constituentGroupsService,
    interactionService
  ) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.loginData.username = window.localStorage.username || "";
    $scope.loginData.password = window.localStorage.password || "";
    $scope.savePassword = true;

    $scope.login = function() {
      //LOGIN REQUEST
      $http({
        method: "POST",
        url: $rootScope.luminate.uri + "CRConsAPI",
        data:
          "method=login" +
          $rootScope.luminate.postdata +
          "&user_name=" +
          $scope.loginData.username +
          "&password=" +
          $scope.loginData.password,
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
          console.log("Log in error:", errorResponse);
          $rootScope.luminate.loggedIn = false;
          $ionicPopup.alert({
            title: "Alert!",
            template: "Username or password is incorrect."
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
        })
        .then(function() {
          setTimeout(function() {
            $state.go("menu.home");
          }, 500);

          interactionService.logInteraction(
            "My ALC Spin login",
            "*** Test ***\nLogged in with My ALC Spin app"
          );
        });
    };
  })

  // @ts-ignore
  .controller("checkInCtrl", function($scope, $stateParams) {})

  // @ts-ignore
  .controller("orientationDayCtrl", function($scope, $stateParams, $rootScope) {
    // @ts-ignore
    JsBarcode("#alc-num-barcode", $rootScope.luminate.tr_info.raceNumber, {
      width: 3
    });
  })

  .controller("incentivesCtrl", function(
    $scope,
    $rootScope,
    // @ts-ignore
    $stateParams,
    // @ts-ignore
    $http,
    incentivesService
  ) {
    /**
     * INCENTIVE KEYS:
     * I_15K = All types $15,000
     * I_10K = All types $10,000
     * I_5K = All types $5,000
     * I_C3K = Cyclist $3,000
     * I_R3K = Roadie $3,000
     * I_C1500 = Cyclist $1,500
     * I_R1500 = Cyclist $1,500
     * I_C1000 = Cyclist $1,000
     * I_C500 = Cyclist 500
     * I_R500 = Roadie 500
     * I_R100 = Roadie 100
     */

    $scope.partType = $rootScope.luminate.tr_info.typeName;

    $scope.incentiveDisplay = {};
    $scope.top545Display = {};
    $scope.top50Display = {};

    $scope.incentives = incentivesService.getIncentives();
    $scope.top545 = incentivesService.getTop545();
    $scope.top50 = incentivesService.getTop50();

    $scope.incentives.on("value", function(snapshot) {
      $scope.$apply(function() {
        $scope.incentiveDisplay = snapshot.val();
      });
    });

    $scope.top545.on("value", function(snapshot) {
      $scope.$apply(function() {
        $scope.top545Display = snapshot.val();
      });
    });

    $scope.top50.on("value", function(snapshot) {
      $scope.$apply(function() {
        $scope.top50Display = snapshot.val();
      });
    });

    $scope.incentiveRefresh = function() {
      $rootScope.refresher();
      $scope.$broadcast("scroll.refreshComplete");
    };
  })

  .controller("bikeLocationCtrl", function(
    $scope,
    $rootScope,
    // @ts-ignore
    $stateParams,
    // @ts-ignore
    $http,
    bikeParkingService
  ) {
    $scope.getBikeInfo = bikeParkingService.getBikeLocation();
    $scope.bike_data = null;

    $scope.getBikeInfo.on("value", function(snapshot) {
      $scope.$apply(function() {
        $scope.bike_data = snapshot.val();
      });
      console.log("Bike data", $scope.bike_data);
    });

    $scope.bikeInfoRefresh = function() {
      $rootScope.refresher();
      $scope.getBikeInfo = bikeParkingService.getBikeLocation();
      $scope.$broadcast("scroll.refreshComplete");
    };
  });
