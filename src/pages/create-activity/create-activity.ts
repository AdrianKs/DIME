import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Geofence } from '@ionic-native/geofence';
import { Utilities } from '../../app/utilities';
import { ViewActivityPage } from '../../pages/view-activity/view-activity';
import firebase from 'firebase';

declare var google;

@IonicPage()
@Component({
  selector: 'page-create-activity',
  templateUrl: 'create-activity.html',
})
export class CreateActivityPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  activityPlace = {
    lat: 0,
    lng: 0
  };
  myDate: Date = new Date();
  myDateDisplay: String;
  myTime: string;
  activityPlaceName: String;
  categories: any[];
  description;
  maxPersonen;
  selectedCategory
  newPostKey: any;
  //possibleAttendees: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public geolocation: Geolocation, public geofence: Geofence, public utilities: Utilities) {
    this.myDate.setHours(this.myDate.getHours() + 2);
    this.myDateDisplay = this.myDate.toISOString();
  }

  ionViewDidLoad() {
    this.categories = this.utilities.categories;
    this.loadMap();
  }

  loadMap() {
    this.utilities.getUserPosition().then(() => {
      let latLng = new google.maps.LatLng(this.utilities.userPositionLat, this.utilities.userPositionLng);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeControlOptions: {
          mapTypeIds: []
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.addMarker();
      this.initAutocomplete();

    })
  }

  addMarker() {
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = "<h4>Information!</h4>";
    this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  initAutocomplete() {
    let map = this.map;
    let tempLatitude;
    let tempLongitude;
    // Create the search box and link it to the UI element.
    var input = (<HTMLInputElement>document.getElementById('pac-input'));;
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', () => {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', () => {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      } else if (places.length > 1) {
        this.showErrorMessage();
        return;
      }

      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }

        tempLatitude = place.geometry.location.lat();
        tempLongitude = place.geometry.location.lng();
        this.activityPlace.lat = tempLatitude;
        this.activityPlace.lng = tempLongitude;
        this.activityPlaceName = place.name;

      });
      map.fitBounds(bounds);
    });
  }

  createActivityOnClick() {
    if (this.activityPlaceName == undefined || this.activityPlace.lat == 0 || this.activityPlace.lng == 0 || this.maxPersonen == undefined || this.description == undefined) {
      let alert = this.alertCtrl.create({
        title: 'Fehlende Informationen',
        subTitle: 'Sie müssen alle Felder ausfüllen, damit eine Aktivität erstellt werden kann.',
        buttons: ['OK']
      });
      alert.present();
    } else {
      this.writeGeofenceToDatabase().then(() => {
        console.log("Aktivität eingetragen");
        this.pushToAllPossibleAttendees().then(() => {
          //this.utilities.sendPushNotification(this.possibleAttendees, "Neue Aktivität: " + this.myDateDisplay + " " + this.activityPlaceName);
        });
        this.navCtrl.setRoot(ViewActivityPage);
        this.navCtrl.popToRoot();
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  pushToAllPossibleAttendees() {
    let userRef = firebase.database().ref('user');
    let possibleAttendees = [];
    console.log("selected Category", this.selectedCategory);
    return userRef.orderByChild('categories/' + this.selectedCategory).equalTo(true).once('value', snapshot => {
      console.log("hier kommen die User: ", snapshot.val());
      for(let i in snapshot.val()){
        if (i != this.utilities.user.uid) {
          let tmpUserLat = snapshot.val()[i].myLat;
          let tmpUserLng = snapshot.val()[i].myLng;
          let tmpDistance = this.utilities.calculateDistanceBetweenUsersAndActivities(tmpUserLat, tmpUserLng, this.activityPlace.lat, this.activityPlace.lng);
          if (tmpDistance <= this.utilities.userData.range) {
            for(let y in snapshot.val()[i].pushid){
              console.log("Es wird gepusht");
              possibleAttendees.push(y);
            }
          }
        }
      }
      this.utilities.sendPushNotification(possibleAttendees, "Neue Aktivität: " + this.myDateDisplay + " " + this.activityPlaceName);
    })
      .catch(err => {
        console.log("firebase error: ", err);
      });
    /*return firebase.database().ref('categorySubscribers/' + this.selectedCategory).once('value', snapshot => {
      if (snapshot.val() != null) {
        for (let i in snapshot.val()) {
          if (i != this.utilities.user.uid) {
            firebase.database().ref('user/' + i).once('value', snapshot => {
              if (snapshot.val() != null) {
                console.log("passiert hier nochmal was");
                let tmpUserLat = snapshot.val().myLat;
                let tmpUserLng = snapshot.val().myLng;
                let tmpDistance = this.utilities.calculateDistanceBetweenUsersAndActivities(tmpUserLat, tmpUserLng, this.activityPlace.lat, this.activityPlace.lng);
                if (tmpDistance <= this.utilities.userData.range) {
                  for(let y in snapshot.val().pushid){
                    console.log("Es wird gepusht");
                    possibleAttendees.push(y);
                  }
                }
              }
              this.utilities.sendPushNotification(possibleAttendees, "Neue Aktivität: " + this.myDateDisplay + " " + this.activityPlaceName);
            }).catch(err => {
              console.log(err);
            });
          }
        }
      }
    }).catch((err) => {
      console.log(err);
    });*/
  }

  writeGeofenceToDatabase() {
    this.newPostKey = firebase.database().ref('activity').push().key;
    return firebase.database().ref('activity').child(this.newPostKey).set({
      attendees: [],
      category: this.selectedCategory,
      creationTime: new Date().toISOString(),
      creator: this.utilities.user.uid,
      date: this.myDateDisplay,
      duration: this.myTime,
      description: this.description,
      locationLat: this.activityPlace.lat,
      locationLng: this.activityPlace.lng,
      locationName: this.activityPlaceName,
      maxAttendees: this.maxPersonen
    });
  }

  showErrorMessage() {
    let alert = this.alertCtrl.create({
      title: 'Fehlerhafte Auswahl',
      subTitle: 'Sie können nur exakt einen Standort für Ihre Aktivität auswählen',
      buttons: ['OK']
    });
    alert.present();
  }
}
