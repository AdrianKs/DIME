import firebase from 'firebase';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class DetailsProvider {

    public userData: any = [];

    public attendeeData: any = [];

    setUserData(userID:any){
        return firebase.database().ref('user/'+userID).once('value', snapshot => {
            this.userData = [];
            let tmpData = snapshot.val();
            this.userData.push(tmpData);
        })
    }

    constructor() {

    }

}
