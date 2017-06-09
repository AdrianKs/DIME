import firebase from 'firebase';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class DetailsProvider {

    public userData: any = [];

    public attendeeData: any = [];

    public category: any = "";

    setUserData(userID:any){
        return firebase.database().ref('user/'+userID).once('value', snapshot => {
            this.userData = [];
            let tmpData = snapshot.val();
            this.userData.push(tmpData);
        })
    }

    getCategoryByID(categoryID:any){
        return firebase.database().ref('category/'+categoryID).once('value', snapshot => {
            console.log(snapshot.val());
            this.category = snapshot.val().name;
        })
    }

    addParticipant(activityID, attendeeArray){
        return firebase.database().ref('activity/'+activityID+ '/').update({
            attendees: attendeeArray
        })
    }

    constructor() {

    }

}
