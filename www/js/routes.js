angular.module('app.routes', [])

  .config(function($stateProvider, $urlRouterProvider) {

    /**
     * Ionic uses AngularUI Router which uses the concept of states
     * Learn more here: https://github.com/angular-ui/ui-router
     * Set up the various states which the app can be in.
     * Each state's controller can be found in controllers.js
     */
    
    $stateProvider
      .state('menu.home', {
        url: '/home',
        views: {
          'side-menu': {
            templateUrl: 'templates/home.html',
            controller: 'homeCtrl'
          }
        }
      })

      .state('menu', {
        url: '/side-menu',
        templateUrl: 'templates/menu.html',
        controller: 'menuCtrl'
      })

      .state('menu.login', {
        url: '/login',
        views: {
          'side-menu': {
            templateUrl: 'templates/login.html',
            controller: 'loginCtrl'
          }
        }
      })

      .state('menu.checkIn', {
        url: '/checkIn',
        views: {
          'side-menu': {
            templateUrl: 'templates/checkIn.html',
            controller: 'checkInCtrl'
          }
        }
      })

      .state('menu.orientationDay', {
        url: '/orientationday',
        views: {
          'side-menu': {
            templateUrl: 'templates/orientationDay.html',
            controller: 'orientationDayCtrl'
          }
        }
      })

      .state('menu.incentives', {
        url: '/incentives',
        views: {
          'side-menu': {
            templateUrl: 'templates/incentives.html',
            controller: 'incentivesCtrl'
          }
        }
      })

      .state('menu.roadies', {
        url: '/roadies',
        views: {
          'side-menu': {
            templateUrl: 'templates/roadies.html',
            controller: 'roadiesCtrl'
          }
        }
      })

      .state('menu.bikeLocation', {
        url: '/bikelocation',
        views: {
          'side-menu': {
            templateUrl: 'templates/bikeLocation.html',
            controller: 'bikeLocationCtrl'
          }
        }
      })

    $urlRouterProvider.otherwise('/side-menu/home')


  });