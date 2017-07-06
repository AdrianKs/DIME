import firebase from 'firebase';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Utilities } from '../app/utilities';

@Injectable()
export class DataProvider {

    dataActivity: Array<any>;
    dataCategory: Array<any>;
    dataUser: Array<any>;
    dataCategorySubs: Array <any>;
    dataFacebookIds: Array <any>;


    constructor(private utilities: Utilities) {

    }

    setActivity() {
        return firebase.database().ref('activity').once('value', snapshot => {
            let activityArray = [];
            let counter = 0;
            for (let i in snapshot.val()) {
                activityArray[counter] = snapshot.val()[i];
                activityArray[counter].id = i;
                activityArray[counter].categorySelected = false;
                activityArray[counter].byFriend = false;
                activityArray[counter].attended = false;
                activityArray[counter].distance = this.utilities.calculateDistanceToActivities(activityArray[counter].locationLat, activityArray[counter].locationLng);
                activityArray[counter].inRange = false;
                counter++;
            }
            this.dataActivity = activityArray;
        });
    }

    setCategory() {
        return firebase.database().ref('category').once('value', snapshot => {
            let categoryArray = [];
            let counter = 0;
            for (let i in snapshot.val()) {
                categoryArray[counter] = snapshot.val()[i];
                categoryArray[counter].id = i;
                counter++;
            }
            this.dataCategory = categoryArray;
        });
    }

    setUser() {
        return firebase.database().ref('user').once('value', snapshot => {
            let userArray = [];
            let counter = 0;
            for (let i in snapshot.val()) {
                userArray[counter] = snapshot.val()[i];
                userArray[counter].id = i;
                counter++;
            }
            this.dataUser = userArray;
        });
    }

    setCategorySubs() {
        return firebase.database().ref('categorySubscribers').once('value', snapshot => {
            let subsArray = [];
            let counter = 0;
            for (let i in snapshot.val()) {
                subsArray[counter] = snapshot.val()[i];
                subsArray[counter].id = i;
                counter++;
            }
            this.dataCategorySubs = subsArray;
        });
    }

    setFacebookId() {
        return firebase.database().ref('facebookIdToUserId').once('value', snapshot => {
            let facebookIdArray = [];
            for (let i in snapshot.val()) {
                facebookIdArray[i] = snapshot.val()[i];
            }
            this.dataFacebookIds = facebookIdArray;
        });
    }

}
