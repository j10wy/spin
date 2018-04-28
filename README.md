# ALC 2018 Event App

### Annual Update Checklist
 - TeamRaiser ID (*fr_id* - www/js/app.js) 
 - Update next year TeamRaiser registration link (www/templates/menu.html)
 - Clock (*homeCtrl* -www/js/controllers.js)
 - Participation type IDs (*teamRaiserService* - www/js/services.js)
 - POM group IDs (*constituentGroupsService* - www/js/services.js)
 - Medical group IDs (*constituentGroupsService* - www/js/services.js)
 - __*Optional*__ Incentive group ID (*constituentGroupsService* - www/js/services.js)

 ### Know Issues 
 Background images on template pages need to be set using inline styles

 ```html
 <ion-content style="background: url(img/bg.svg) no-repeat center top;background-size:cover;" />
 ```