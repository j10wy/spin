angular.module('app.services', [])

  .service('loginService', function ($http, $rootScope) {
    return {
      data: {},
      getLogin: function (username, password) {
        self = this;
        $http({
          method: 'POST',
          url: $rootScope.luminate.uri + 'CRConsAPI',
          data: 'method=login' + $rootScope.luminate.postdata + '&user_name=' + username + '&password=' + password,
          headers: $rootScope.luminate.header
        }).success(function (data) {
          self.data = data.loginResponse;
          return self.data;
        }).error(function (error) {
          console.log(error.errorResponse.message);
        });
      }
    }
  })
  .service('constituentService', function ($http, $rootScope) {
    return {
      getConsRecord: function () {
        $http({
          method: 'POST',
          url: $rootScope.luminate.uri + 'CRConsAPI',
          data: 'method=getUser' + $rootScope.luminate.postdata + '&cons_id=' + $rootScope.luminate.cons_id + '&sso_auth_token=' + $rootScope.luminate.token,
          headers: $rootScope.luminate.header
        }).then(function (consResponse) {

          $rootScope.luminate.cons_info = consResponse.data.getConsResponse;

          var customBooleans = $rootScope.luminate.cons_info.custom.boolean;
          var customStrings = $rootScope.luminate.cons_info.custom.string;

          $rootScope.groupArray = [].concat(customBooleans, customStrings);

          //Angular forEach testing Custom Strings
          angular.forEach($rootScope.groupArray, function (value, key) {

            var cons_customId = value.id;
            var cons_customContent = value.content;

            switch (cons_customId) {

              case 'custom_boolean3':
                // Bike Parking boolean
                $rootScope.luminate.bikeParking = (cons_customContent === 'true') ? true : false;
                break;

              case 'custom_boolean13':
                // Bike Parking boolean
                $rootScope.luminate.bikeParking = (cons_customContent === 'true') ? true : false;
                break;

              case 'custom_string3':
                // Roadie Team Assignment
                $rootScope.luminate.roadieTeamAssignment = cons_customContent;
                break;

              case 'custom_string5':
                // Roadie Team Captain
                $rootScope.luminate.roadieTeamCaptain = cons_customContent;
                break;

              case 'custom_string9':
                // Meal Preference
                $rootScope.luminate.tentAddress = cons_customContent;
                console.log('tentAddress:', $rootScope.luminate.tentAddress);
                break;

              case 'custom_string11':
                // Meal Preference
                $rootScope.luminate.mealPreference = cons_customContent;
                console.log('mealPreference:', $rootScope.luminate.mealPreference);
                break;

              case 'custom_string14':
                // Tent Keyword
                $rootScope.luminate.tentKeyword = cons_customContent;
                console.log('tentKeyword:', $rootScope.luminate.tentKeyword);
                break;

              case 'custom_string16':
                // ALC Representitive
                $rootScope.luminate.alcRep = cons_customContent;
                console.log('alcRep:', $rootScope.luminate.alcRep);
                break;

              case 'custom_string19':
                // ALC Region
                $rootScope.luminate.alcRegion = cons_customContent;
                console.log('alcRegion:', $rootScope.luminate.alcRegion);
                break;

              case 'custom_string30':
                // ALC Shirt Size
                $rootScope.luminate.shirtSize = cons_customContent;
                console.log('shirtSize:', $rootScope.luminate.shirtSize);
                break;
            }
          });
          console.log('Constituent Information', $rootScope.luminate.cons_info);
          console.log('Bike Parking:', $rootScope.luminate.bikeParking);
        }, function (consResponseErorr) {
          console.log('Error getting Constituent Information', consResponseErorr);
        });
      }
    }
  })
  .service('incentivesService', function ($rootScope, $stateParams, $http, ) {
    var cons_id = $rootScope.luminate.cons_id;

    return {
      getIncentives: function getIncentives() {
        console.log("Hi from the incentivesService 👋");
        var incentives = fb.database().ref('/' + cons_id);
        return incentives;
      },
      updateIncentives: function updateIncentives(incentiveObject) {
        firebase.database().ref('/' + cons_id).set(incentiveObject);
      }
    }

  })
  .service('interactionService', function ($rootScope, $stateParams, $http) {
    return {
      logInteraction: function (subject, body) {
        // Log login interaction to CONS profile
        $http({
          method: 'POST',
          url: $rootScope.luminate.uri + 'CRConsAPI',
          data: 'method=logInteraction' + $rootScope.luminate.postdata + '&interaction_subject=' + subject + '&cons_id=' + $rootScope.luminate.cons_id + '&interaction_body=' + body + '&interaction_type_id=1010&sso_auth_token=' + $rootScope.luminate.token,
          headers: $rootScope.luminate.header
        }).success(function (loginResponseData) {
          console.log('Login interaction successful');
        }).error(function (response) {
          console.log('Interaction error:', response);
        });
      }
    }
  })
  .service('teamRaiserService', function ($http, $rootScope) {
    return {
      getTeamRaiserRegistration: function () {
        $http({
          method: 'POST',
          url: $rootScope.luminate.uri + 'CRTeamraiserAPI',
          data: 'method=getRegistration' + $rootScope.luminate.postdata + '&sso_auth_token=' + $rootScope.luminate.token + '&fr_id=' + $rootScope.luminate.fr_id,
          headers: $rootScope.luminate.header
        }).then(function (trResponse) {

          $rootScope.luminate.tr_info = trResponse.data.getRegistrationResponse.registration;

          // Update the IDs in the switch statement below using the participation type IDs in the TeamRasier settings
          // IDs are located in Luminate Online > TeamRaiser > [TeamRaiser Campaign] > 7. Manage Participation Types

          switch ($rootScope.luminate.tr_info.participationTypeId) {
            case $rootScope.luminate.type_id.cyclist:
              // Participation type is Cyclist
              $rootScope.luminate.tr_info.typeName = 'Cyclist';
              break;
            case $rootScope.luminate.type_id.staff:
              // Participation type is Staff
              $rootScope.luminate.tr_info.typeName = 'Staff';
              break;
            case $rootScope.luminate.type_id.roadie:
              // Participation type is Staff
              $rootScope.luminate.tr_info.typeName = 'Roadie';
              break;
          }

        }, function (trResponseErorr) {

          console.log('Error getting TeamRaiser Registration:', trResponseErorr);

        });
      }
    }
  })
  .service('tentMateService', function ($http, $rootScope) {

    return {
      getTentMate: function () {
        $http({
          method: 'POST',
          url: $rootScope.luminate.uri + 'CRTeamraiserAPI',
          data: 'method=getTentmate' + $rootScope.luminate.postdata + '&sso_auth_token=' + $rootScope.luminate.token + '&fr_id=' + $rootScope.luminate.fr_id,
          headers: $rootScope.luminate.header
        }).then(function (tentMateResponse) {

          // 0 = Initial status 
          // 1 = Eligible for pairing
          // 2 = No tent required 
          // 3 = Single tent 
          // 4 = Requested 
          // 5 = Requested by tentmate 
          // 6 = Requested by tentmate and eligible 
          // 7 = Accepted awaiting eligibility 
          // 8 = Accepted awaiting tentmate eligibility 
          // 9 = Accepted and confirmed 

          $rootScope.luminate.tentMate = tentMateResponse.data.getTentmateResponse.record;

        }, function (tentMateResponseErorr) {

          console.log('Error getting TeamRaiser Registration:', tentMateResponseErorr);

        });
      }
    }
  })
  .service('participantProgress', function ($http, $rootScope) {
    return {
      getProgress: function () {
        $http({
          method: 'POST',
          url: $rootScope.luminate.uri + 'CRTeamraiserAPI',
          data: 'method=getParticipantProgress' + $rootScope.luminate.postdata + '&cons_id=' + $rootScope.luminate.cons_id + '&fr_id=' + $rootScope.luminate.fr_id,
          headers: $rootScope.luminate.header
        }).then(function (partProgressResponse) {

          $rootScope.luminate.tr_part_progress = partProgressResponse.data.getParticipantProgressResponse.personalProgress;

        }, function (partProgressErorr) {

          console.log('Error getting trPartReponse: ', partProgressErorr);

        });
      }
    }
  })
  .service('constituentGroupsService', function ($http, $rootScope) {
    return {
      getGroups: function () {
        $http({
          method: 'POST',
          url: $rootScope.luminate.uri + 'CRConsAPI',
          data: 'method=getUserGroups' + $rootScope.luminate.postdata + '&sso_auth_token=' + $rootScope.luminate.token + '&cons_id=' + $rootScope.luminate.cons_id,
          headers: $rootScope.luminate.header
        }).then(function (grpResponse) {

          $rootScope.luminate.grp_info = grpResponse.data.getConsGroupsResponse.group;

          angular.forEach($rootScope.luminate.grp_info, function (value, key) {

            var convioGroupId = value.id;

            switch (convioGroupId) {
              // Assign POM time to groups object.
              // Participants are added to an email group associated with each POM when they RSVP
              // The IDs in the Switch statement below are the email group IDs
              case $rootScope.luminate.group_id.pom_one:
                $rootScope.luminate.groups.pom = '9:00 AM';
                break;
              case $rootScope.luminate.group_id.pom_two:
                $rootScope.luminate.groups.pom = '11:00 AM';
                break;
              case $rootScope.luminate.group_id.pom_three:
                $rootScope.luminate.groups.pom = '2:00 PM';
                break;
              case $rootScope.luminate.group_id.pom_four:
                $rootScope.luminate.groups.pom = '4:00 PM';
              case $rootScope.luminate.group_id.medical:
                // The group ID for the ALC Medform Complete group.
                // Clear the group of all memebers. Update the checkbox. Run query with same name.
                $rootScope.luminate.groups.med_form = true;
            }
          });

        }, function (grpResponseErorr) {
          console.log('Error getting grpResponse: ', grpResponseErorr);
        });
      }
    }

  });
