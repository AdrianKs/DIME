import firebase from 'firebase';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class DataProvider {

    dataActivity: Array<any>;
    dataCategory: Array<any>;
    dataUser: Array<any>;


    constructor() {

    }

    setActivity() {
        return firebase.database().ref('activity').once('value', snapshot => {
            let activityArray = [];
            let counter = 0;
            for (let i in snapshot.val()) {
                activityArray[counter] = snapshot.val()[i];
                activityArray[counter].id = i;
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

}
