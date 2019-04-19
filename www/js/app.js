// This app is dedicated to the memory of Gilbert Valenzuela ❤️.

/**
 * angular.module is a global place for creating, registering and retrieving Angular modules
 * 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
 * the 2nd parameter is an array of 'requires'
 * 'starter.services' is found in services.js
 * 'starter.controllers' is found in controllers.js
 */

angular
  .module("app", [
    "ionic",
    "app.controllers",
    "app.routes",
    "app.directives",
    "app.services"
  ])

  .config(function($ionicConfigProvider, $sceDelegateProvider) {
    $ionicConfigProvider.backButton.text("").previousTitleText(false);

    $sceDelegateProvider.resourceUrlWhitelist(["self"]);
  })
  .run(function(
    $ionicPlatform,
    $rootScope,
    $http,
    $log,
    loginService,
    constituentService,
    teamRaiserService,
    constituentGroupsService,
    participantProgress,
    tentMateService
  ) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (
        window.cordova &&
        window.cordova.plugins &&
        window.cordova.plugins.Keyboard
      ) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });

    /**
     * Initialize values in the $rootScope.luminate.luminate object.
     * These values will be different for each particpant and will be updated after login.
     * See controllers/AppCtrl.js to view how groups are updated at login.
     * The Cyclist, Roadie, and Staff ID's and fr_id need to be updated each year.
     */
    $rootScope.luminate = {
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      uri: "https://actnow.tofighthiv.org/site/",
      postdata: "&api_key=" + alcAPIkey + "&v=1.0&response_format=json",
      username: "",
      password: "",
      token: "",
      cons_id: "",
      fr_id: "2110",
      type_id: {
        cyclist: "",
        staff: "",
        roadie: ""
      },
      group_id: {
        pom_one: "",
        pom_two: "",
        pom_three: "",
        pom_four: "",
        medical: ""
      },
      loggedIn: false,
      bikeParking: false,
      tr_info: {},
      tr_part_progress: {},
      incentives: {},
      roadieTeamAssignment: "",
      roadieTeamCaptain: "",
      tentAddress: "",
      tentKeyword: "",
      tentMate: {},
      alcRegion: "",
      warning: false,
      groups: {
        pom: "NO RSVP",
        med_form: false,
        incentive_pickup: false
      }
    };

    /**
     * Intiliaze $rootScope.incentivesInfo.
     * This will store an object of incentives earned by the participant.
     */

    $rootScope.ticketToRide = function() {
      $rootScope.luminate.warning = false;

      if ($rootScope.luminate.tentAddress === undefined) {
        console.log("Ticket to Ride - No tent address");
      }
      if (
        $rootScope.luminate.tr_info.typeName === "Cyclist" &&
        $rootScope.luminate.tr_part_progress.raised < "3000"
      ) {
        console.log("Ticket to Ride - Cyclist with less than 3K");
      }
    };

    $rootScope.refresher = function() {
      console.log("------ Running Refresher ------");
      loginService.getLogin(
        $rootScope.luminate.username,
        $rootScope.luminate.password
      );
      constituentService.getConsRecord();
      teamRaiserService.getTeamRaiserRegistration();
      constituentGroupsService.getGroups();
      participantProgress.getProgress();
      tentMateService.getTentMate();
      $rootScope.ticketToRide();
      $rootScope.$broadcast("scroll.refreshComplete");
    };
  })

  /**
   * This directive is used to disable the "drag to open" functionality of the Side-Menu
   * when you are dragging a Slider component.
   */

  .directive("disableSideMenuDrag", [
    "$ionicSideMenuDelegate",
    "$rootScope",
    function($ionicSideMenuDelegate, $rootScope) {
      return {
        restrict: "A",
        controller: [
          "$scope",
          "$element",
          "$attrs",
          function($scope, $element, $attrs) {
            function stopDrag() {
              $ionicSideMenuDelegate.canDragContent(false);
            }

            function allowDrag() {
              $ionicSideMenuDelegate.canDragContent(true);
            }

            $rootScope.$on("$ionicSlides.slideChangeEnd", allowDrag);
            $element.on("touchstart", stopDrag);
            $element.on("touchend", allowDrag);
            $element.on("mousedown", stopDrag);
            $element.on("mouseup", allowDrag);
          }
        ]
      };
    }
  ])

  /**
   * This directive is used to open regular and
   * dynamic href links inside of inappbrowser.
   */
  .directive("hrefInappbrowser", function() {
    return {
      restrict: "A",
      replace: false,
      transclude: false,
      link: function(scope, element, attrs) {
        var href = attrs["hrefInappbrowser"];

        attrs.$observe("hrefInappbrowser", function(val) {
          href = val;
        });

        element.bind("click", function(event) {
          window.open(href, "_system", "location=yes");
          event.preventDefault();
          event.stopPropagation();
        });
      }
    };
  });

var firebaseIncentives = firebase.initializeApp(
  fb_incentives_config,
  "firebaseIncentives"
);
var firebaseBikeParking = firebase.initializeApp(
  fb_bikeParking_config,
  "firebaseBikeParking"
);
var fb_appConfig = firebase.initializeApp(fb_app_config, "firebaseAppConfig");
