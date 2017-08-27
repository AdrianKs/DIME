import firebase from 'firebase';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class DetailsProvider {

    public userData: any = [];

    public attendeeData: any = [];

    public originalAttendees: any = [];

    public category: any = "";

    public temporaryUserObject: any = [];

    setCreatorData(userID:any){
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

    addParticipant(activityID, partictipantID){
        return firebase.database().ref('activity/'+activityID+ '/'+partictipantID+'/').set(true);
    }

    getAttendees(activityID){
        return firebase.database().ref('activity/'+activityID+ '/attendees/').once('value', snapshot => {
            this.originalAttendees = snapshot.val();
        })
    }

    getUserObjectOfEventCreator(creatorID){
        return firebase.database().ref('user/'+creatorID).once('value', snapshot => {
            this.temporaryUserObject = snapshot.val();
        })
    }

    getTemporaryUserObject(){
        return this.temporaryUserObject;
    }

    constructor() {

    }

}
