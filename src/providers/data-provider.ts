import firebase from 'firebase';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class DataProvider {

    dataActivity: Array<any>;
    dataCategory: Array<any>;


    constructor() {

    }

    setActivity() {
        console.log("WHATWHAT")
        return firebase.database().ref('activity').once('value', snapshot => {
            console.log("YAYAYA")
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

}
