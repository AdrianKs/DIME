// Initialize app and store it to myApp variable for futher access to its methods
var myApp = new Framework7();
 
// We need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
 
// Add view
var mainView = myApp.addView('.view-main', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  dynamicNavbar: true
});

//Variables

window.onload = function(){
    console.log("onInit index");
    document.addEventListener("deviceready", onDeviceReady, false); 
}

function onDeviceReady() { 
    document.getElementById("armsweak").addEventListener("click", batteryStatus);
    document.getElementById("kneesheavy").addEventListener("click", checkConnection);
    document.getElementById("momsspaghetti").addEventListener("click", openCamera);
    document.getElementById("palmssweaty").addEventListener("click", checkDeviceMotion);
    document.getElementById("sweateralready").addEventListener("click", checkDeviceOrientation);
    document.getElementById("deezContacts").addEventListener("click", showContacts);
    document.getElementById("FileSystem").addEventListener("click", getFileSystem);
    console.log(cordova.file);
    console.log(navigator.accelerometer);
    console.log(navigator.compass);
    console.log(navigator.contacts);
}

// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    console.log("onInit about")
    /*document.addEventListener("deviceready", function () {
    console.log("onInit About");
    document.getElementById("armsweak").addEventListener("click", batteryStatus);
    document.getElementById("kneesheavy").addEventListener("click", checkConnection);
    document.getElementById("momsspaghetti").addEventListener("click", openCamera);
    document.getElementById("palmssweaty").addEventListener("click", checkDeviceMotion);
    document.getElementById("sweateralready").addEventListener("click", checkDeviceOrientation);
    });*/
})
 
/*// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
  // Get page data from event data
  var page = e.detail.page;
  
  if (page.name === 'about') {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
  }
})*/
 
/*// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
  // Following code will be executed for page with data-page attribute equal to "about"
  myApp.alert('Here comes About page');
})*/

//Contacts
function showContacts(){
    function onSuccess(contacts) {
        for (var i = 0; i < contacts.length; i++) {
            alert("Formatted: "  + contacts[i].name.formatted       + "\n" +
                "Family Name: "  + contacts[i].name.familyName      + "\n" +
                "Given Name: "   + contacts[i].name.givenName       + "\n" +
                "Middle Name: "  + contacts[i].name.middleName      + "\n" +
                "Suffix: "       + contacts[i].name.honorificSuffix + "\n" +
                "Prefix: "       + contacts[i].name.honorificSuffix);
        }
    };

    function onError(contactError) {
        alert('onError!');
    };
    var options = new ContactFindOptions();
    options.filter = "";
    options.multiple = true;
    filter = ["displayName", "name"];
    navigator.contacts.find(filter, onSuccess, onError, options);
}



//Connection
function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

    myApp.alert('[Connection](connection.html) type: ' + states[networkState]);
}

//Battery
function batteryStatus(){
  window.addEventListener("batterystatus", onBatteryStatus, false);
  function onBatteryStatus(status) {
      myApp.alert("Level: " + status.level + " isPlugged: " + status.isPlugged);
  }
}

//Camera
function setOptions(srcType) {
    var options = {
        // Some common settings are 20, 50, and 100
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true  //Corrects Android orientation quirks
    }
    return options;
}

function openCamera(selection) {
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
      console.log(navigator.camera);
    }

    var srcType = Camera.PictureSourceType.CAMERA;
    var options = setOptions(srcType);

    navigator.camera.getPicture(function cameraSuccess(imageUri) {

        displayImage(imageUri);
        getFileEntry(imageUri);
        // You may choose to copy the picture, save it somewhere, or upload.

    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");

    }, options);
}

function displayImage(imgUri) {
    var elem = document.getElementById('imageFile');
    elem.src = "data:image/jpeg;base64," + imgUri;
}

//Filesystem
function getFileSystem(){
    window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {

        console.log('file system open: ' + fs.name);
        console.log(fs);
        createFile(fs.root, "newTempFile.txt", false);

    }, onErrorLoadFs);
    function onErrorLoadFs() {
            myApp.alert('Error loading filesystem!');
    }
}

function createFile(dirEntry, fileName, isAppend) {
    // Creates a new file or returns the file if it already exists.
    dirEntry.getFile(fileName, {create: true, exclusive: false}, function(fileEntry) {

        var entry = document.getElementById("entry").value;
        console.log(entry);
        writeFile(fileEntry, entry, isAppend);

    }, onErrorCreateFile);
    function onErrorCreateFile() {
        myApp.alert('Error creating file!');
    }
}

function writeFile(fileEntry, dataObj, isAppend) {
    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            console.log("Successful file read...");
            console.log(fileEntry);
            readFile(fileEntry);
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file read: " + e.toString());
        };

        // If we are appending data to file, go to the end of the file.
        if (isAppend) {
            try {
                fileWriter.seek(fileWriter.length);
            }
            catch (e) {
                console.log("file doesn't exist!");
            }
        }
        fileWriter.write(dataObj);
    });
}

function readFile(fileEntry) {

    fileEntry.file(function (file) {
        var reader = new FileReader();

        reader.onloadend = function() {
            console.log("Successful file read: " + this.result);
        };

        reader.readAsText(file);

    }, onErrorReadFile);
    function onErrorReadFile() {
        myApp.alert('Error reading file!');
    }
}

//DeviceMotion

function checkDeviceMotion(){
    function onSuccess(acceleration) {
        myApp.alert('Acceleration X: ' + acceleration.x + '\n' +
            'Acceleration Y: ' + acceleration.y + '\n' +
            'Acceleration Z: ' + acceleration.z + '\n' +
            'Timestamp: '      + acceleration.timestamp + '\n');
    }

    function onError() {
        myApp.alert('onError!');
    }
    navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);
}

//DeviceOrientation

function checkDeviceOrientation(){
    function onSuccess(heading) {
        myApp.alert('Heading: ' + heading.magneticHeading);
    };

    function onError(error) {
        myApp.alert('CompassError: ' + error.code);
    };

    navigator.compass.getCurrentHeading(onSuccess, onError);
}

