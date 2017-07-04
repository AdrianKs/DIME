import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Geofence } from '@ionic-native/geofence';
import { Geolocation } from '@ionic-native/geolocation';
import { Calendar } from '@ionic-native/calendar';
import { AlertController, NavController } from 'ionic-angular';
import { ActivityDetailsPage } from '../pages/activity-details/activity-details';


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
    userActivitesArray: any[];
    myActivitesFromOther: any[] = [];
    picture: any;
    platform: string;

    constructor(public geofence: Geofence,
        public geolocation: Geolocation,
        public calendar: Calendar,
        public alertCtrl: AlertController) {
        this.getCategories();
        //this.getUserPosition();
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
            //console.log(this.userCategories);
            this.getSpecificUserActivites();
        });
    }

    setLocalUserData(userData): void {
        this.userData = userData;
        this.userLoaded = true;
    }

    getUserPosition() {
        return this.geolocation.getCurrentPosition().then((position) => {
            this.userPositionLat = position.coords.latitude;
            this.userPositionLng = position.coords.longitude;
            this.storeUserPosition(this.userPositionLat, this.userPositionLng);
        }, (err) => {
            console.log(err);
        });
    }

    storeUserPosition(lat, lng) {
        firebase.database().ref('user/' + this.user.uid).update({
            myLat: lat,
            myLng: lng
        }).catch((err) => {
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
                this.userActivitesArray = activitiesArray;
                for (let i = 0; i < this.userActivitesArray.length; i++) {
                    for (let prob in this.userCategories) {
                        if (this.userActivitesArray[i].category == prob && this.userActivitesArray[i].creator != this.user.uid) {
                            this.myActivitesFromOther.push(this.userActivitesArray[i]);
                            if (this.calculateEndTime(this.userActivitesArray[i].date, this.userActivitesArray[i].duration) <= new Date()) {
                                this.removeGeofence(this.userActivitesArray[i].id);
                            } else {
                                if (this.checkCalendar(this.userActivitesArray[i].date, this.userActivitesArray[i].duration) == true) {
                                    this.createGeofence(this.userActivitesArray[i], this.userActivitesArray[i].id);
                                }
                            }
                        }
                    }
                }
            }
        });
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

    calculateDistanceBetweenUsersAndActivities(myLat, myLng, actLat, actLng) {
        let R = 6731; //Radius of the earth in km
        let dLat = this.degTorad(actLat - myLat);
        let dLng = this.degTorad(actLng - myLng);
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.degTorad(this.userPositionLat)) * Math.cos(this.degTorad(myLat)) *
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
    createGeofence(activity, cid) {
        let id = cid;
        let lat = activity.locationLat;
        let lng = activity.locationLng;
        let place = activity.locationName;
        let date = activity.date;
        let notificationId = this.makeid();

        let fence = {
            id: id, //any unique ID
            latitude: lat, //center of geofence radius
            longitude: lng,
            radius: 1000, //radius to edge of geofence in meters
            transitionType: 1, //see 'Transition Types' below
            notification: { //notification settings
                id: notificationId, //any unique ID
                title: 'Eine neue Aktivität', //notification title
                text: place + ' ' + date, //notification body
                icon: "file://assets/icon/icon.png",
                openAppOnClick: true, //open app when notification is tapped
                data: activity
            }
        }
        console.log(fence);
        this.geofence.addOrUpdate(fence).then(
            () => console.log('Geofence added'),
            (err) => console.log('Geofence failed to add')
        );
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

    addGeofenceByCategroy(categoryID) {
        firebase.database().ref('activity').once(`value`, snapshot => {
            if (snapshot.val() != null) {
                for (let i in snapshot.val()) {
                    if (categoryID == snapshot.val()[i].category) {
                        let currentDate = new Date();
                        currentDate.setHours(currentDate.getHours() + 2);
                        let customDate = currentDate.toISOString();
                        console.log(customDate);
                        if (customDate <= snapshot.val()[i].date && snapshot.val()[i].date != this.user.uid) {
                            this.createGeofence(snapshot.val()[i], i);
                        }
                    }
                }
            }
        });
    }

    removeGeofenceByCategory(categoryID) {
        this.myActivitesFromOther.forEach(element => {
            if (categoryID == element.category) {
                this.removeGeofence(element.id);
            }
        });
    }

    removeGeofence(geofenceId) {
        this.geofence.remove(geofenceId).then(
            () => console.log("Geofence removed"),
            (err) => console.log("Geofence failed to remove")
        );
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
        return status;
    }

    createCalendarEntry(startDate: Date, duration, title, eventLocation) {
        let start = new Date(startDate);
        start.setSeconds(0);
        let end = this.calculateEndTime(start, duration);
        console.log("Start: " + start + " End: " + end);
        this.calendar.createEvent(title, eventLocation, "", start, end);
    }

    increaseIntInDB(databasePath) {
        console.log("in increaese");
        firebase.database().ref(databasePath).transaction((current_value) => {
            return (current_value || 0) + 1;
        });
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

    storeRating(ratedUserId, rateValue) {
        return firebase.database().ref('ratings/' + this.user.uid + '/' + ratedUserId).set(rateValue)
            .catch(err => {
                console.log('Error while storing Rating ', err);
            });
    }

    checkIfNotYetRated(ratedUserId) {
        return firebase.database().ref('ratings/' + this.user.uid + '/' + ratedUserId).once('value')
            .then(snapshot => {
                if (snapshot.val()) {
                    return false;
                } else {
                    return true;
                }
            })
            .catch(err => {
                console.log("Error while check if already rated ", err);
            })
    }

    storeAllowedToRate(userIdToRate) {
        firebase.database().ref('allowedToRate/' + this.user.uid + '/' + userIdToRate).set(true)
            .catch(err => {
                console.log("Error while storing allowed to rate ", err);
            });
        return firebase.database().ref('allowedToRate/' + userIdToRate + '/' + this.user.uid).set(true)
            .catch(err => {
                console.log("Error while storing allowed to rate ", err);
            });
    }

    deleteAllowedToRate(userIdToDelete) {
        firebase.database().ref('allowedToRate' + this.user.uid + '/' + userIdToDelete).remove()
            .catch(err => {
                console.log("Error while deleting allowed to rate", err);
            });
        return firebase.database().ref('allowedToRate' + userIdToDelete + '/' + this.user.uid).remove()
            .catch(err => {
                console.log("Error while deleting allowed to rate", err);
            });
    }

    checkAllowedToRate(userIdToRate) {
        return firebase.database().ref('allowedToRate/' + this.user.uid + '/' + userIdToRate).once('value')
            .then(snapshot => {
                return snapshot.val();
            })
            .catch(err => {
                console.log("Error while checking If allowed to rate ", err);
            })
    }

    sendPushNotification(pushIds: Array<any>, content: String) {
        console.log("Hier kommen die PushIds", pushIds);
        if (!(this.platform === "dom")) {
            let notificationObj = {
                contents: { en: content },
                include_player_ids: pushIds
            };
            window["plugins"].OneSignal.postNotification(notificationObj,
                function (successResponse) {
                    console.log("Notification Post Success: ", successResponse);
                },
                function (failedResponse) {
                    console.log("Notification Post Failed: ", failedResponse);
                }
            )
        }
    }
}
