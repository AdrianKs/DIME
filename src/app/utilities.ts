import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Geofence } from '@ionic-native/geofence';
import { Geolocation } from '@ionic-native/geolocation';


@Injectable()
export class Utilities {
    
    categories: any[];
    userPositionLat: number = 0;
    userPositionLng: number = 0;
    userCategories: any[];
    distancesToActivities: any[];
    geofenceAreas: any[];

    constructor(public geofence: Geofence, public geolocation: Geolocation) {
        this.getCategories();
    }

    getUserPosition() {
        return this.geolocation.getCurrentPosition().then((position) => {
            this.userPositionLat = position.coords.latitude,
                this.userPositionLng = position.coords.longitude
        }, (err) => {
            console.log(err);
        });
    }

    getCategories() {
        firebase.database().ref('category').once('value', snapshot => {
            if (snapshot.val() != null) {
                let categoriesArray = [];
                let counter = 0;
                for (let i in snapshot.val()) {
                    categoriesArray[counter] = snapshot.val()[i];
                    categoriesArray[counter].id = i;
                    counter++;
                }
                this.categories = categoriesArray;
            }
        });
    }

    getPlayerCategories() {
      
    }

    getSpecificUserActivites() {
        firebase.database().ref('activity').once(`value`, snapshot => {
            if (snapshot.val() != null) {
                let geofenceArray = [];
                let counter = 0;
                for (let i in snapshot.val()) {
                    geofenceArray[counter] = snapshot.val()[i];
                    geofenceArray[counter].id = i;
                    counter++;
                }
                this.geofenceAreas = geofenceArray;
                this.calculateDistanceToActivites();
                this.createGeofenceAreas();
            }
        });
    }

    calculateDistanceToActivites() {

    }

    createGeofenceAreas() {
        /*
        let fence = {
            id: '69ca1b88-6fbe-4e80-a4d4-ff4d3748acdb', //any unique ID
            latitude: lat, //center of geofence radius
            longitude: lng,
            radius: 1000, //radius to edge of geofence in meters
            transitionType: 1, //see 'Transition Types' below
            notification: { //notification settings
                id: 1, //any unique ID
                title: 'Eine neue Aktivität', //notification title
                text: place + ' ' + date, //notification body
                openAppOnClick: true //open app when notification is tapped
            }
        }
        this.geofence.addOrUpdate(fence).then(
            () => console.log('Geofence added'),
            (err) => console.log('Geofence failed to add')
        );
        */
    }

}