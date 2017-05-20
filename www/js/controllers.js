angular.module('app.controllers', [])
  
.controller('homeCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

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
            var pastDeadline = today > deadline ? "past the deadline" : "good to go!";
            console.log("Deadline: You are ", pastDeadline)
            

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

        var deadline = new Date('June 4, 2017 07:00:00');
        initializeClock('clockdiv', deadline);

}])
   
.controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('loginCtrl', function ($scope, $timeout, $stateParams, $rootScope, $http, $log, loginService, constituentService, teamRaiserService, tentMateService, participantProgress, constituentGroupsService) {

// Form data for the login modal
    $scope.loginData = {};
    $scope.loginData.username = window.localStorage.username || "";
    $scope.loginData.password = window.localStorage.password || "";
    $scope.savePassword = true;

        // Perform the login action when the user submits the login form
    $scope.login = function() {

        //LOGIN REQUEST
        $http({
                method: 'POST',
                url: $rootScope.luminate.uri + "CRConsAPI",
                data: "method=login" + $rootScope.luminate.postdata + "&user_name=" + $scope.loginData.username + "&password=" + $scope.loginData.password,
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

                $timeout(function() {
                    $scope.closeLogin();
                }, 2000);
            })
            .then(function() {

                //Get Constituent Profile
                constituentService.getConsRecord();

            }).then(function() {

                //Get TeamRaiser Registration
                teamRaiserService.getTeamRaiserRegistration();

            }).then(function() {

                //Get Participant Tent Mate Information
                tentMateService.getTentMate();

            }).then(function() {

                //Participant Progress
                participantProgress.getProgress();

            }).then(function() {

                //Constituent Groups
                constituentGroupsService.getGroups();

            }).then(function() {
                $timeout(function() {
                    $scope.closeLogin();
                }, 500);
                console.log("RootScope Luminate Object:", $rootScope.luminate)
            });

    };

})
   
.controller('checkInCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('orientationDayCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('incentivesCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('roadiesCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('bikeLocationCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
 