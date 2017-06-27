import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Geofence } from '@ionic-native/geofence';
import { Geolocation } from '@ionic-native/geolocation';
import { Calendar } from '@ionic-native/calendar';
import { AlertController } from 'ionic-angular';

@Injectable()
export class Utilities {

    user: any;
    userData: any = {};
    userLoaded: boolean = false;
    categories: any[];
    userPositionLat: number = 0;
    userPositionLng: number = 0;
    userCategories: {};
    distancesToActivities: any[] = [];
    activitesAreas: any[];
    picture: any;
    platform: string;

    constructor(public geofence: Geofence, public geolocation: Geolocation, public calendar: Calendar, public alertCtrl: AlertController) {
        this.getCategories();
        this.getUserPosition();
        this.getSpecificUserActivites();
    }
    setUserData(): void {
        firebase.database().ref('user/' + this.user.uid).once('value', snapshot => {
            if (snapshot.val() != null) {
                console.log("in snapshot");
                this.userData = snapshot.val();
                this.userLoaded = true;
            }
            this.userCategories = this.userData.categories;
            console.log(this.userCategories);
            this.getSpecificUserActivites();
        });
    }

    setLocalUserData(userData): void {
        this.userData = userData;
        this.userLoaded = true;
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

    getSpecificUserActivites() {
        firebase.database().ref('activity').once(`value`, snapshot => {
            if (snapshot.val() != null) {
                let activitiesArray = [];
                let counter = 0;
                for (let i in snapshot.val()) {
                    activitiesArray[counter] = snapshot.val()[i];
                    activitiesArray[counter].id = i;
                    counter++;
                }
                this.activitesAreas = activitiesArray;
                for (let i = 0; i < this.activitesAreas.length; i++) {
                    for (let prob in this.userCategories) {
                        console.log(this.user.uid);
                        console.log(this.activitesAreas[i].id);
                        if (this.activitesAreas[i].category == prob && this.activitesAreas[i].creator != this.user.uid) {
                            if (this.calculateEndTime(this.activitesAreas[i].date, this.activitesAreas[i].duration) <= new Date()) {
                                this.removeGeofence(this.activitesAreas[i].id);
                                console.log("removed");
                            } else {
                                this.calculateDistanceToActivites(this.activitesAreas[i].locationLat, this.activitesAreas[i].locationLng);
                                if (this.checkCalendar(this.activitesAreas[i].date, this.activitesAreas[i].duration) == true) {
                                    console.log("added");
                                    this.createGeofenceAreas(this.activitesAreas[i].id,
                                        this.activitesAreas[i].locationLat,
                                        this.activitesAreas[i].locationLng,
                                        this.activitesAreas[i].locationName,
                                        this.activitesAreas[i].date,
                                        this.activitesAreas[i].creationDate,
                                        this.activitesAreas[i].duration);
                                }
                            }
                        }
                    }
                }
            }
        });
    }


    calculateDistanceToActivites(lat, lng) {
        let R = 6731; //Radius of the earth in km
        let dLat = this.degTorad(this.userPositionLat - lat);
        let dLng = this.degTorad(this.userPositionLng - lng);
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.degTorad(this.userPositionLat)) * Math.cos(this.degTorad(lat)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c; // Distance in km

        this.distancesToActivities.push(d);
    }

    calculateDistanceToActivities(lat, lng) {
        let R = 6731; //Radius of the earth in km
        let dLat = this.degTorad(this.userPositionLat - lat);
        let dLng = this.degTorad(this.userPositionLng - lng);
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.degTorad(this.userPositionLat)) * Math.cos(this.degTorad(lat)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c; // Distance in km
        d = Math.round(d * 100) / 100;
        return d;
    }

    degTorad(deg) {
        return deg * (Math.PI / 180)
    }

    //Handle start und end time as a number
    createGeofenceAreas(id, lat, lng, place, date, creationDate, duration) {
        let tmpDate: Date = new Date(creationDate);
        let tmpStartDate = date.substring(0, 10);
        let tmpStartTime: Number;
        let tmpEndTime: Number;
        let notificationId = this.makeid();

        let fence = {
            id: id, //any unique ID
            latitude: lat, //center of geofence radius
            longitude: lng,
            radius: 1000, //radius to edge of geofence in meters
            transitionType: 1, //see 'Transition Types' below
            timeWindow: {
                startDate: tmpStartDate, //Date string, yyyy-MM-dd
                interval: 0, //Interval in days
                startTime: tmpStartTime, //Start time (device locale) of geofence on each day, HH:mm
                endTime: tmpEndTime, //End time (device locale) of geofence on each day, HH:mm
            },
            notification: { //notification settings
                id: notificationId, //any unique ID
                title: 'Eine neue Aktivität', //notification title
                text: place + ' ' + date, //notification body
                openAppOnClick: true //open app when notification is tapped
            }
        }
        console.log(fence);
        this.geofence.addOrUpdate(fence).then(() => {
            console.log('Geofence added')
        }).catch((err) =>{
            console.log("Geofence failed to add " + err);
        });
        //this.watchGeofence();
    }

    makeid() {
        let text = "";
        let possible = "0123456789";
        let textAsNumber: Number;

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        textAsNumber = Number(text);
        return textAsNumber;
    }

    watchGeofence() {
        this.geofence.onTransitionReceived().subscribe(res => {
            let tempLoc = res;
            tempLoc.forEach(location => {
                //Hier kann entsprechend ein Ereignis eintreten sobald ein Geofence betreten wird.
            });
        }, (err) => {
            console.log(err);
        });
    }

    removeGeofence(geofenceId) {
        this.geofence.remove(geofenceId).then(() => {
            console.log('Geofence sucessfully removed');
        }).catch((err) => {
            console.log("Geofence removing failed");
        });
    }

    checkCalendar(startDate: Date, duration: string) {
        let start = new Date(startDate);
        start.setSeconds(0);
        let end = this.calculateEndTime(startDate, duration);
        let status = true;

        //Currently only available for android
        this.calendar.listEventsInRange(start, end).then((result: any[]) => {
            console.log(result);
            if (result.length > 0) {
                console.log("Termin im Weg");
                status = false;
            } else {
                console.log("keine Termine")
                status = true;
            }
        }).catch((err) => {
            console.log(err);
        });
        return true;
    }

    calculateEndTime(startDate: Date, duration: string) {
        let hour = Number(duration.substring(0, 2));
        let minute = Number(duration.substring(4, 6));
        let end = new Date(startDate);
        end.setHours(end.getHours() + hour);
        end.setMinutes(end.getMinutes());
        end.setSeconds(0);

        return end;
    }

    sendPushNotification(pushIds: Array<any>, content: String) {
      if(!(this.platform === "dom")){
        let notificationObj = {
          contents: {en: content},
          include_player_ids: pushIds
        };
        window["plugins"].OneSignal.postNotification(notificationObj,
          function(successResponse) {
          },
          function (failedResponse) {
            console.log("Notification Post Failed: ", failedResponse);
          }
        )
      }
    }
}
