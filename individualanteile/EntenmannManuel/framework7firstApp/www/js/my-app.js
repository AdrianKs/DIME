// Initialize app
var myApp = new Framework7();

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

var myLatitude;
var myLongitude;

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        console.log('test');
        //myApp.alert('Here comes About page');
    }
});

document.addEventListener("deviceready", function () {
    document.getElementsByClassName("btnTest")[0].addEventListener('click', openCamera);
    document.getElementsByClassName("btnLoad")[0].addEventListener('click', loadData);
    document.getElementsByClassName("btnStore")[0].addEventListener('click', storeData);
    document.getElementsByClassName("btnDelete")[0].addEventListener('click', deleteData);
    document.getElementsByClassName("btnOpenApp")[0].addEventListener('click', openApp);
    document.getElementsByClassName("btnSendMessage")[0].addEventListener('click', sendMessage);
    universalLinks.subscribe(null, myApp.didLaunchAppFromLink);
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    window.addEventListener("batterystatus", onBatteryStatus, false);
    initialzieLoginElements();
});

function initialzieLoginElements() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBEcS4a_D5qulQX1T9aNfhit1LxWisxkXw",
        authDomain: "framework7firstapp.firebaseapp.com",
        databaseURL: "https://framework7firstapp.firebaseio.com",
        storageBucket: "framework7firstapp.appspot.com",
        messagingSenderId: "1045297308211"
    };
    firebase.initializeApp(config);

    var txtEmail = document.getElementById("txtEmail");
    var txtPassword = document.getElementById("txtPassword");
    var btnLogin = document.getElementById("btnLogin");
    var btnSignUp = document.getElementById("btnSignUp");
    var btnLogout = document.getElementById("btnLogout");

    btnLogin.addEventListener('click', e => {
        var email = txtEmail.value;
        var password = txtPassword.value;

        var auth = firebase.auth();

        var promise = auth.signInWithEmailAndPassword(email, password);
        promise.catch(e => console.log(e.message));
    });

    btnSignUp.addEventListener('click', e => {
        var email = txtEmail.value;
        var password = txtPassword.value;

        var auth = firebase.auth();

        var promise = auth.createUserWithEmailAndPassword(email, password);
        promise.catch(e => console.log(e.message));
    });

    btnLogout.addEventListener("click", e => {
        firebase.auth().signOut();
    });

    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            console.log(firebaseUser)
            document.getElementById("myUser").innerHTML = firebaseUser.email;
            myApp.closeModal();
        } else {
            console.log("not logged in");
        }
    });
}

function onBatteryStatus(status) {
    console.log("Level: " + status.level + " isPlugged: " + status.isPlugged);
    document.getElementById('pBatteryStat').innerHTML = "Level: " + status.level + " isPlugged: " + status.isPlugged;
}

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

    var srcType = Camera.PictureSourceType.CAMERA;
    var options = setOptions(srcType);
    //var func = createNewFileEntry;

    navigator.camera.getPicture(function cameraSuccess(imageUri) {
        var image = document.getElementById('myImage');
        image.src = "data:image/jpeg;base64," + imageUri;
        // movePic(imageUri);
    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");
    }, options);
}

function displayImage(imgUri) {
    console.log(imgUri);
}

function movePic(file) {
    window.resolveLocalFileSystemURL(file, resolveOnSuccess, resOnError);
}

function resolveOnSuccess(entry) {
    var d = new Date();
    var n = d.getTime();

    var newFileName = n + ".jpg";
    var myFolderApp = "MyAppFolder";

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {

        fileSys.root.getDirectory(myFolderApp,
            { create: true, exclusive: false },
            function (directory) {
                entry.moveTo(directory, newFileName, successMove, resOnError);
            },
            resOnError);
    },
        resOnError);
}

function successMove(entry) {
    sessionStorage.setItem('imagepath', entry.fullPath);
}

function resOnError(error) {
    console.log(error);
    alert(error.code);
}

function storeData() {
    var formData = document.getElementById('name').value
    if (typeof (Storage) !== "undefined") {
        localStorage.setItem("meinname", formData);
        document.getElementById('name').value = "";
    }
}

function loadData() {
    document.getElementById('name').value = localStorage.getItem("meinname");
}

function deleteData() {
    if (localStorage.getItem("meinname") != null) {
        localStorage.setItem("meinname", null);
    }
}


function openApp() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    var addressLongLat = myLatitude + "," + myLongitude;

    if (/android/i.test(userAgent)) {
        window.open("geo:" + addressLongLat);
    } else {
        window.open("http://maps.google.com/?q=" + addressLongLat, '_system');
    }
}

function didLaunchAppFromLink(eventData) {
    alert('Did launch application from the link: ' + eventData.url);
}


//Get current location
var onSuccess = function (position) {
    myLatitude = position.coords.latitude;
    myLongitude = position.coords.longitude;
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

//Send Message in Messenger
function sendMessage() {
    window.plugins.socialsharing.shareViaSMS('Nur der BVB', null, function (msg) {
        console.log('ok: ' + msg)
    }, function (msg) {
        alert('error: ' + msg)
    });
}



//chrome://inspect/#devices
//https://github.com/themikenicholson/passport-jwt