# ALC 2018 Event App

### Annual Update Checklist
 - Update the following properties in www/js/app.js:
 	- *fr_id* - This is the ID number assigned to the TeamRaiser
 	- *type_id* - Participation type IDs. The ID numbers are found in the TeamRaiser settings under `Participation Types`.
 	- *group_id.pom_* - Update each POM with their corresponding `group ID` in Luminate Online.
 	- *group_id.medical* - Update the medical property with it's corresponding `group ID` in Luminate Online.
 - Update next year TeamRaiser registration link (www/templates/menu.html)
 - Clock (*homeCtrl* -www/js/controllers.js)

 ### Updating the app for Ionic & Cordova Builds

Every year there is alway an issue an updating and deploying the app for iOS. Here is what I had to do for the 2018 app.

- First, save the currently installed Cordova plugins `cordova plugin save`
- Remove the iOS platform `cordova platform rm ios`
- View the installed Cordova plugins `cordova plugin list`
- The [release of cordova-ios (4.5) requires that the cordova-plugin-console plugin be removed](https://forum.ionicframework.com/t/ionic-not-building-for-ios-linker-command-failed-error-65/91481/7) from your project in order to build since it is now integrated directly `cordova plugin rm cordova-plugin-console`
- If issues persist, remove and re-install each of the Cordova plugins `cordova plugin rm cordova-plugin-<name-of-plugin>`
- Reinstall the iOS platform `cordova platform add ios`
- Finally, run `ionic cordova build ios --prod`

For more help, run `cordova --help` or `cordova plugin --help`