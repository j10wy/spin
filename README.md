# ALC 2019 Event App

Table of Contents<br>

- [Commands](#commands)<br>
- [Annual Update Checklist](#annual-update-checklist)<br>
- [Firebase Realtime Database](#firebase-realtime-database)<br>
- [Import Data to Firebase via Command Line](#import-data-to-firebase-via-command-line)<br>
- [Generating Icons and Splash Images](#generating-icons-and-splash-images)<br>
- [Deploy to the App Stores](#deploy-to-the-app-stores)

## Commands

**Ionic Cordova Prepare** ([docs](https://ionicframework.com/docs/cli/commands/cordova-prepare)) - Copies assets to Cordova platforms, preparing them for native builds. Use `ionic cordova prepare` if you run your project with `Android Studio` or `Xcode`.

`ionic cordova prepare [android |ios]`

**Ionic Serve** ([docs](https://ionicframework.com/docs/cli/commands/serve)) - Starts a local dev server for app dev/testing and watches for changes in your source files and automatically reloads with the updated build.

`ionic serve`

## Annual Update Checklist

1. Update the following properties in www/js/app.js:

   - `fr_id` - This is the ID number assigned to the TeamRaiser

   - `type_id` - Participation type IDs. The ID numbers are found in the TeamRaiser settings under `Participation Types`.

   - `group_id.pom` - Update each POM with their corresponding `group ID` in Luminate Online.

   - `group_id.medical` - Update the medical property with it's corresponding `group ID` in Luminate Online.

2. Update next year's TeamRaiser registration link `www/templates/menu.html`

3. The countdowb clock `homeCtrl -www/js/controllers.js`

4. Update the Incentives Firebase database.

5. Update the Bike Parking Firebase database.

## Updating the app for Ionic & Cordova Builds

**_Every year there is always an issue an updating and deploying the app for iOS_**. Here is what I had to do for the 2018 and 2019 apps.

- First, save the currently installed Cordova plugins `cordova plugin save`

- Remove the iOS platform `cordova platform rm ios`

- Remove the Android platform `cordova platform rm android`

- View the installed Cordova plugins `cordova plugin list`

- The [release of cordova-ios (4.5+) requires that the cordova-plugin-console plugin be removed](https://forum.ionicframework.com/t/ionic-not-building-for-ios-linker-command-failed-error-65/91481/7) from your project in order to build since it is now integrated directly `cordova plugin rm cordova-plugin-console`

- If issues persist, remove and re-install each of the Cordova plugins `cordova plugin rm cordova-plugin-<name-of-plugin>`

- Reinstall the iOS platform `cordova platform add ios`

- Reinstall the Android platform `cordova platform add android`

- Finally, run `ionic cordova build [platform-name] --prod` -where `platform-name` is `ios` or `android`.

**_For more info/help, run_** `cordova --help` or `cordova plugin --help`

## Firebase Realtime Database

[Firebase Docs](https://firebase.google.com/docs/database/web/read-and-write)

If a client loses its network connection, your app will continue functioning correctly.

Every client connected to a Firebase database maintains its own internal version of any active data. When data is written, it's written to this local version first. The Firebase client then synchronizes that data with the remote database servers and with other clients on a "best-effort" basis.

As a result, all writes to the database trigger local events immediately, before any data is written to the server. This means your app remains responsive regardless of network latency or connectivity.

Once connectivity is reestablished, your app receives the appropriate set of events so that the client syncs with the current server state, without having to write any custom code.

**_\*Note: The Firebase Realtime Database web APIs do not persist data offline outside of the session. In order for writes to be persisted to the server, the web page must not be closed before the data is written to the server._**

## Import Data to Firebase via Command Line

1. Open the CSV in Sublime Text

2. Using the `DataConvter` Plugin, choose the option labled `DataConverter: to JSON (first column as key)`

3. Enter the following command in the terminal: - Replace `<project-name`> with the name of the database. - Replace the `path` with the path you want to update/replace - Replace the `./demo-firebase-import.json` with the path to the JSON file.

```
firebase-import --database_url https://<project-name>.firebaseio.com --path /demo --json ./demo-firebase-import.json
```

See the [firebase-import](https://github.com/firebase/firebase-import) repo for more information.

## Generating Icons and Splash Images

Usage:<br>
`$ ionic cordova resources [<platform>] [options]`

_**Note**: By default, this command will not regenerate resources whose source image has not changed. To disable this functionality and always overwrite generated images, use --force._

Ionic can automatically generate perfectly sized icons and splash screens from source images (.png, .psd, or .ai) for your Cordova platforms.

- The source image for icons should ideally be at least 1024×1024px and located at resources/icon.png.
- The source image for splash screens should ideally be at least 2732×2732px and located at resources/splash.png.

Options:

    --force, -f .............. Force regeneration of resources
    --icon, -i ............... Generate icon resources
    --splash, -s ............. Generate splash screen resources

Examples:

`$ ionic cordova resources`<br>
`$ ionic cordova resources ios`<br>
`$ ionic cordova resources android`

## Deploy to the App Stores

1. Read through each up the sections above to update the app.

2. Run `ionic cordova prepare ios` and `ionic cordova android` to prepare the app for native builds.

3. To prepare for Android, navigate to `platforms > android` and open the folder in Android Studio.

4. To prepare for iOS, navigate to `platforms > ios` and open the file ending in `.xcodeproj` to open the project in Xcode.

5. Update Apple development and distribution certificates

6. Generate [Apple screenshots](https://help.apple.com/app-store-connect/#/devd274dd925).

### Apple development and distribution certificates

The certificates expire in May. Renew them in March or April.

### Android Publishing

To generate a release build for Android, we can use the following cordova cli command:

```bash
$ ionic cordova build --release android
```

### Sign the Android App

[Sign your app with your upload key](https://developer.android.com/studio/publish/app-signing)
