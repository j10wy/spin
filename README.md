# ALC 2018 Event App

Table of Contents<br>
- [Annual Update Checklist](#annual-update-checklist)<br>
- [Import Data to Firebase via Firebase Console](#import-data-to-firebase-via-firebase-console)<br>
- [Import Data to Firebase via Command Line](#import-data-to-firebase-via-command-line)<br>
- [Write data offline from Firebase Docs](#write-data-offline-from-firebase-docshttpsfirebasegooglecomdocsdatabasewebread-and-write)<br>
- [Generating Icons and Splash Images](#generating-icons-and-splash-images)

### Annual Update Checklist
 - Update the following properties in www/js/app.js:
 	- *fr_id* - This is the ID number assigned to the TeamRaiser
 	- *type_id* - Participation type IDs. The ID numbers are found in the TeamRaiser settings under `Participation Types`.
 	- *group_id.pom_* - Update each POM with their corresponding `group ID` in Luminate Online.
 	- *group_id.medical* - Update the medical property with it's corresponding `group ID` in Luminate Online.
 - Update next year TeamRaiser registration link (www/templates/menu.html)
 - Clock (*homeCtrl* -www/js/controllers.js)
 - Update the incentives and bike parking Firebase databases.

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

### Import Data to Firebase via Firebase Console

### Import Data to Firebase via Command Line

1) Open the CSV in Sublime Text
2) Using the `DataConvter` Plugin, choose the option labled `DataConverter: to JSON (first column as key)`
3) Enter the following command in the terminal:
	- Replace `<project-name`> with the name of the database.
	- Replace the `path` with the path you want to update/replace
	- Replace the `./demo-firebase-import.json` with the path to the JSON file.
```
firebase-import --database_url https://<project-name>.firebaseio.com --path /demo --json ./demo-firebase-import.json
```
See the [firebase-import](https://github.com/firebase/firebase-import) repo for more information.

### Write data offline (from [Firebase Docs](https://firebase.google.com/docs/database/web/read-and-write))
If a client loses its network connection, your app will continue functioning correctly.

Every client connected to a Firebase database maintains its own internal version of any active data. When data is written, it's written to this local version first. The Firebase client then synchronizes that data with the remote database servers and with other clients on a "best-effort" basis.

As a result, all writes to the database trigger local events immediately, before any data is written to the server. This means your app remains responsive regardless of network latency or connectivity.

Once connectivity is reestablished, your app receives the appropriate set of events so that the client syncs with the current server state, without having to write any custom code.

Note: The Firebase Realtime Database web APIs do not persist data offline outside of the session. In order for writes to be persisted to the server, the web page must not be closed before the data is written to the server.

### Generating Icons and Splash Images

Usage:<br>
`$ ionic cordova resources [<platform>] [options]`

*__Note__: By default, this command will not regenerate resources whose source image has not changed. To disable this functionality and always overwrite generated images, use --force.*

Ionic can automatically generate perfectly sized icons and splash screens from source images (.png, .psd, or .ai) for your Cordova platforms. 

* The source image for icons should ideally be at least 1024×1024px and located at resources/icon.png.
* The source image for splash screens should ideally be at least 2732×2732px and located at resources/splash.png.

 Options:

    --force, -f .............. Force regeneration of resources
    --icon, -i ............... Generate icon resources
    --splash, -s ............. Generate splash screen resources

  Examples:

`    $ ionic cordova resources`<br>
`    $ ionic cordova resources ios`<br>
`    $ ionic cordova resources android`
