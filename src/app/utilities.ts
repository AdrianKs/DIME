import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class Utilities {

    categories: any[];

    constructor() {
        this.getCategory();
    }

    getCategory() {
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

}