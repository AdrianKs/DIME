import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Geofence } from '@ionic-native/geofence';
import { Geolocation } from '@ionic-native/geolocation';
import { Calendar } from '@ionic-native/calendar';

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

    constructor(public geofence: Geofence, public geolocation: Geolocation, public calendar: Calendar) {
        this.getCategories();
        this.getUserPosition();
        this.getSpecificUserActivites();
    }

    checkIT(startDate: string, duration: string) {
        let hour = Number(duration.substring(0, 2));
        let minute = Number(duration.substring(4, 6));
        let start = new Date(startDate)
        console.log(start);
        let end = new Date(startDate);
        end.setHours(end.getHours() + hour);
        end.setMinutes(end.getMinutes());
        console.log(end);

        this.calendar.listEventsInRange(start, end).then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
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
                        if (this.activitesAreas[i].category == prob) {
                            this.calculateDistanceToActivites(this.activitesAreas[i].locationLat, this.activitesAreas[i].locationLng);
                            if (this.checkCalendar(this.activitesAreas[i].startDate, this.activitesAreas[i].duration) == true) {
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

    degTorad(deg) {
        return deg * (Math.PI / 180)
    }

    //Handle start und end time as a number
    createGeofenceAreas(id, lat, lng, place, date, creationDate, duration) {
        let tmpDate: Date = new Date(creationDate);
        let tmpStartDate = date.substring(0, 10);
        let tmpStartTime: Number;
        let tmpEndTime: Number;
       
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
                id: id, //any unique ID
                title: 'Eine neue Aktivität', //notification title
                text: place + ' ' + date, //notification body
                openAppOnClick: true //open app when notification is tapped
            }
        }
        console.log(fence);
        this.geofence.addOrUpdate(fence).then(
            () => console.log('Geofence added'),
            (err) => console.log('Geofence failed to add')
        );
        //this.watchGeofence();
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
        this.geofence.remove(geofenceId)
            .then(()=> {
                console.log('Geofence sucessfully removed');
            }
            , (err) => {
                console.log('Removing geofence failed', err);
            });
    }

    checkCalendar(startDate: Date, duration: string) {
        let start = new Date(startDate)
        let end = this.calculateEndTime(startDate, duration);

        this.calendar.listEventsInRange(start, end).then((result) => {
            console.log(result);
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
        console.log(end);

        return end;
    }
}
