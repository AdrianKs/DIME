/**
 * Created by kochsiek on 11.01.2017.
 */
// Initialize app
var myApp = new Framework7();

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

document.addEventListener('deviceready', function () {
    window.addEventListener("batterystatus", onBatteryStatus, false);

    window.geofence.initialize().then(function () {
        console.log("Successful initialization");
    }, function (error) {
        console.log("Error", error);
    });

    window.geofence.onTransitionReceived = function (geofences) {
        geofences.forEach(function (geo) {
            //geo.longitude = getLongitude;
            //geo.latitude = getLatitude;
            alert("Transition");
        });
    };
});

function onBatteryStatus(status) {
    console.log(status.level);

}

// Now we need to run the code that will be executed only for About page.

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
})

function cam () {
    var options = {
        quality : 75,
        destinationType : Camera.DestinationType.FILE_URI,
        sourceType : Camera.PictureSourceType.CAMERA,
        allowEdit : true,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        targetWidth: 500,
        targetHeight: 500,
        saveToPhotoAlbum: false
    };

    navigator.camera.getPicture(onSuccess, onFail,  options);

    function onSuccess(imageData) {
        //console.log("Camera cleanup success.")
        alert("klasse");
        var image = document.getElementById('image');
        image.src = imageData;
        //image.style.margin = "10px";
        image.style.display = "block";

        saveImageToGallery(imageData);
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
}

function openMaps() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    var addressLongLat = "geo:38.897096,-77.036545";

    console.log(userAgent);

    if (/android/i.test(userAgent)) {
        window.open("geo:" + addressLongLat);
    } else {
        window.open("http://maps.google.com/?q=" + addressLongLat, '_system');
    }
}

function shareSocial() {
    // this is the complete list of currently supported params you can pass to the plugin (all optional)
    var options = {
        message: 'open the nicest app', // not supported on some apps (Facebook, Instagram)
        subject: 'Deep link to my app', // fi. for email
        files: ['', ''], // an array of filenames either locally or remotely
        url: 'http://examplecordova.com',
        chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
    };

    var onSuccess = function(result) {
        console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
        console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
    };

    var onError = function(msg) {
        console.log("Sharing failed with message: " + msg);
    };

    window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
}

function saveImageToGallery(img) {
    window.cordova.plugins.imagesaver.saveImageToGallery(img, onSaveImageSuccess, onSaveImageError);

    function onSaveImageSuccess() {
        console.log('--------------success');
    }

    function onSaveImageError(error) {
        console.log('--------------error: ' + error);
    }
}

function shareInWhatsApp() {
    window.plugins.socialsharing.shareViaWhatsApp('1 nice whatsapp message vong sharing her', null /* img */, 'http://1niceapp.com',
        function() {console.log('share ok')},
        function(errormsg){alert(errormsg)});
}

function getPosition() {

    var options = {
        enableHighAccuracy: true,
        maximumAge: 3600000
    }

    var watchID = navigator.geolocation.getCurrentPosition(onSuccessGeo, onErrorGeo, options);

    function onSuccessGeo(position) {

        alert('Latitude: '          + position.coords.latitude          + '\n' +
            'Longitude: '         + position.coords.longitude         + '\n' +
            'Altitude: '          + position.coords.altitude          + '\n' +
            'Accuracy: '          + position.coords.accuracy          + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
            'Heading: '           + position.coords.heading           + '\n' +
            'Speed: '             + position.coords.speed             + '\n' +
            'Timestamp: '         + position.timestamp                + '\n');
    };

    function onErrorGeo(error) {
        alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
    }
}
function getLatitude() {
    var options = {
        enableHighAccuracy: true,
        maximumAge: 10
    }

    return navigator.geolocation.getCurrentPosition(onSuccessGeo, onErrorGeo, options);

    function onSuccessGeo(position) {

        return position.coords.latitude;
    }

    function onErrorGeo(error) {
        alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
    }
}
function getLongitude() {
    var options = {
        enableHighAccuracy: true,
        maximumAge: 10
    }

    return navigator.geolocation.getCurrentPosition(onSuccessGeo, onErrorGeo, options);

    function onSuccessGeo(position) {

        return position.coords.longitude;
    }

    function onErrorGeo(error) {
        alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
    }
}

function getLocation() {
    var options = {
        enableHighAccuracy: true,
        maximumAge: 10
    }

    navigator.geolocation.getCurrentPosition(onSuccessGeo, onErrorGeo, options);

    function onSuccessGeo(position) {

        addGeoFence(position.coords.latitude, position.coords.longitude);
    }

    function onErrorGeo(error) {
        alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
    }
}


function addGeoFence(lat, long) {
    window.geofence.addOrUpdate({
        id:             "mygeofenceid", //A unique identifier of geofence
        latitude:       lat, //Geo latitude of geofence
        longitude:      long, //Geo longitude of geofence
        radius:         1, //Radius of geofence in meters
        transitionType: 3, //Type of transition 1 - Enter, 2 - Exit, 3 - Both
        notification: {         //Notification object
            title:          'GeofenceStuff', //Title of notification
            text:           'GeofenceStuff', //Text of notification
            openAppOnClick: true,//is main app activity should be opened after clicking on notification
            vibration:      [1000, 500, 2000] //Optional vibration pattern - see description
        }
    }).then(function () {
        console.log('Geofence successfully added');
        alert('Geofence successfully added');

    }, function (reason) {
        console.log('Adding geofence failed', reason);
        alert('Geofence failed');
    });
}




