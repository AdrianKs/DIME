/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        window.addEventListener("batterystatus", onBatteryStatus, false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.




    setOptions: function (srcType) {
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
    },



    displayImage: function (imgUri) {
        console.log(imgUri);
        var image = document.getElementById('myPicture');
        image.src = "data:image/jpeg;base64," + imgUri;
    },

    onDeviceReady: function () {
        this.receivedEvent('deviceready');
        document.getElementById("camera-button").addEventListener('click', cameraPressed);
    },



    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');



        console.log('Received Event: ' + id);
    }
};

function cameraPressed(selection) {
    var options = setOptions(srcType);
    var srcType = Camera.PictureSourceType.CAMERA;
    navigator.camera.getPicture(function cameraSuccess(imageURI) {
        displayImage(imageURI);
    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");

    }, options);
}

function displayImage(imgUri) {
    console.log(imgUri);
    var image = document.getElementById('myPicture');
    image.src = "data:image/jpeg;base64," + imgUri;
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

function onBatteryStatus(status) {
    console.log("Level: " + status.level + " isPlugged: " + status.isPlugged);
}

function getMyPosition() {
    navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
}

function getMyAcceleration() {
    navigator.accelerometer.getCurrentAcceleration(onAccSuccess, onAccError);
}

function getMyDeviceOrientation() {
    navigator.compass.watchHeading(onOrientationSuccess, onOrientationError, {
        frequency: 2000
    });
}

function onOrientationSuccess(heading) {
    document.getElementById('heading').innerHTML = "Orientierungs-Heading: <br>" + heading.magneticHeading;
}

function onOrientationError(error) {
    console.log(error);
}

function onAccSuccess(acceleration) {
    document.getElementById('Acc-X').innerHTML = "Bewegung X: <br>" + acceleration.x;
    document.getElementById('Acc-Y').innerHTML = "Bewegung Y: <br>" + acceleration.y;
    document.getElementById('Acc-Z').innerHTML = "Bewegung Z: <br>" + acceleration.z;
}

function onAccError(error) {
    console.log(error);
}




function onGeoSuccess(position) {

    document.getElementById("Lat").innerHTML = "Latitude: <br>" + position.coords.latitude;
    document.getElementById("Long").innerHTML = "Longitude: <br>" + position.coords.longitude;
    document.getElementById("Timestamp").innerHTML = "Timestamp: <br>" + position.timestamp;

}

function onGeoError(error) {
    alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

app.initialize();