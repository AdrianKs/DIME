import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Geofence } from '@ionic-native/geofence';
import { Utilities } from '../../app/utilities';

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
  myDate: String = new Date().toISOString();
  activityPlaceName: String;
  categories: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation, public geofence: Geofence, public utilities: Utilities) { }

  ionViewDidLoad() {
    this.categories = this.utilities.categories;
    console.log(this.categories);
    this.loadMap();
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

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

    }, (err) => {
      console.log(err);
    });
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
        console.log(this.activityPlaceName);

        console.log(this.activityPlace);

      });
      map.fitBounds(bounds);
    });
  }

  createActivityOnClick() {
    let id = 1;

    let fence = {
      id: '69ca1b88-6fbe-4e80-a4d4-ff4d3748acdb', //any unique ID
      latitude: this.activityPlace.lat, //center of geofence radius
      longitude: this.activityPlace.lng,
      radius: 1000, //radius to edge of geofence in meters
      transitionType: 1, //see 'Transition Types' below
      notification: { //notification settings
        id: 1, //any unique ID
        title: 'Eine neue Aktivität', //notification title
        text: this.activityPlace + ' ' + this.myDate, //notification body
        openAppOnClick: true //open app when notification is tapped
      }
    }


    /*this.geofence.addOrUpdate(fence).then(
         () => console.log('Geofence added'),
         (err) => console.log('Geofence failed to add')
       );*/

  }

}
