import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { DetailsProvider } from '../../providers/details-provider';
import { ProfilePage } from '../profile/profile';
import { Utilities } from "../../app/utilities";
import firebase from 'firebase';
import {LoginPage} from "../login/login";
import { SocialSharing } from '@ionic-native/social-sharing';
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'activity-details-page',
  templateUrl: 'activity-details.html',
  providers: [DetailsProvider]
})
export class ActivityDetailsPage {

  private activityData: any = [];

  private activityID: any = [];

  private userData: any = [];

  private userID: any = [];

  private creatorName: any = "";

  private creatorID: any = "";

  private creatorObject: any = [];

  private activityTime: any = "";

  private locationName: any = "";

  private participants: any = [];

  private attendees: any = [];

  private originalAttendeeArray: any = [];

  private description: any = "";

  private picURL: any = "";

  private category: any = "";

  private eventByUser: boolean = false;

  private participating: boolean = null;

  private attendeeCount: any = 0;

  private maxAttendees: any = 0;

  private actionSheet: any = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dProvider: DetailsProvider, public utilities: Utilities, public actionController: ActionSheetController, public socialSharer: SocialSharing) {
    if (!this.utilities.user.uid || this.utilities.user == {}) {
      this.navCtrl.setRoot(LoginPage);
    } else {
      let thatIs = this;
      this.activityID = this.navParams.get('id');
      this.getActivityData(this.activityID).then(function() {
        thatIs.prepareItemData();
      })
    }
  }

  getActivityData(id){
    return firebase.database().ref('activity/'+id+ '/').once('value', snapshot => {
      this.activityData = snapshot.val();
    });
  }

  prepareItemData() {
    this.userID = this.utilities.user.uid;
    console.log("my userID: " + this.userID);
    this.creatorID = this.activityData.creator;

    this.checkEventCreator();



    this.activityTime = this.activityData.date;
    this.locationName = this.activityData.locationName;
    this.description = this.activityData.description;
    let participantsTemp = this.activityData.attendees;
    this.maxAttendees = this.activityData.maxAttendees;
    this.checkParticipateStatus();
    let that = this;
    this.dProvider.getAttendees(this.activityID).then(function () {
      that.originalAttendeeArray = that.dProvider.originalAttendees;
      console.log(that.originalAttendeeArray);
    })

    this.dProvider.getUserObjectOfEventCreator(this.creatorID).then(function () {
      that.creatorObject = that.dProvider.getTemporaryUserObject();
    });

    this.setCategory(this.activityData.category);

    for (let p in participantsTemp) {
      let tmp = {
        id: p
      }
      this.participants.push(tmp);
      this.attendeeCount++;
    }

    console.log(this.participants);
    this.getCreatorData();
    this.getAttendeeData();
  }

  setCategory(id) {
    let thatIs = this;
    this.dProvider.getCategoryByID(id).then(function () {
      thatIs.category = thatIs.dProvider.category;
    })
  }

  getCreatorData() {
    let thatIs = this;
    this.dProvider.setCreatorData(this.creatorID).then(function () {
      thatIs.userData = thatIs.dProvider.userData;
      thatIs.defineActivityItems();
    });
  }

  getAttendeeData() {
    this.attendees = [];
    let thatIs = this;
    console.log(this.participants);
    for (let p of this.participants) {
      let id = p.id;
      this.dProvider.setCreatorData(id).then(function () {
        thatIs.userData = thatIs.dProvider.userData;
        console.log(thatIs.userData[0]);
        let data = {
          id: id,
          name: thatIs.userData[0].name,
          minAge: thatIs.userData[0].minAge,
          picURL: thatIs.userData[0].picURL
        }
        thatIs.attendees.push(data);
      })
    }
  }

  defineActivityItems() {
    this.creatorName = this.userData[0].name;
    this.picURL = this.userData[0].picURL;
  }

  participateOnEvent() {
    if (this.attendeeCount < this.maxAttendees) {
      let thatIs = this;
      firebase.database().ref('activity/' + this.activityID + '/attendees/' + this.userID + '/').set(true).then(function () {
        thatIs.attendeeCount++;
        thatIs.participating = true;
        thatIs.refreshAttendeeArray();
      });
      this.utilities.storeAllowedToRate(this.creatorID);
      for (let i in this.attendees){
        this.utilities.storeAllowedToRate(this.attendees[i].id);
      }
    } else {
      //ALERT AUSGEBEN
    }
  }

  declineEvent(){
    let thatIs = this;
    firebase.database().ref('activity/' + this.activityID + '/attendees/' + this.userID).remove().then(function () {
        thatIs.attendeeCount--;
        thatIs.participating = false;
        thatIs.refreshAttendeeArray();
      });
    this.utilities.storeAllowedToRate(this.creatorID);
    for(let i in this.attendees){
      this.utilities.deleteAllowedToRate(this.attendees[i].id);
    }

  }

  deleteEvent(){
    let thatIs = this;
    firebase.database().ref('activity/' + this.activityID).remove().then(function () {
      thatIs.navCtrl.popToRoot();
    })
  }


  refreshAttendeeArray() {
    let thatIs = this;
    this.attendees = [];
    this.dProvider.getAttendees(this.activityID).then(function () {
      thatIs.originalAttendeeArray = thatIs.dProvider.originalAttendees;
      for (let i in thatIs.originalAttendeeArray) {
        thatIs.dProvider.setCreatorData(i).then(function () {
          thatIs.userData = thatIs.dProvider.userData;
          console.log(thatIs.userData[0]);
          let data = {
            id: i,
            name: thatIs.userData[0].name,
            minAge: thatIs.userData[0].minAge,
            picURL: thatIs.userData[0].picURL
          };
          thatIs.attendees.push(data);
        })
      }
    })
  }

  navigateToProfile() {
    this.navCtrl.push(ProfilePage, {
      userId: this.creatorID,
      user: this.creatorObject
    })
  }

  checkParticipateStatus() {
    for (let i in this.activityData.attendees) {
      if (i == this.userID) {
        this.participating = true;
      }
    }
  }

  checkEventCreator() {
    if (this.creatorID == this.userID) {
      this.eventByUser = true;
    }
  }

  shareWithOptions(){
    if(this.utilities.platform === 'dom'){
      alert("Diese Option ist nur auf nativen Geräten verfügbar");
    } else {
      let options = {
        message: 'Nehmen Sie mit mir an der Aktivität ' + this.category + ' des Veranstalters ' + this.creatorName + ' teil.', // not supported on some apps (Facebook, Instagram)
        subject: 'Nehmen Sie mit mir an dieser Aktivität teil', // fi. for email
        url: 'dime://app/activity/' + this.activityID,
        chooserTitle: 'Wählen Sie eine App' // Android only, you can override the default share sheet title
      };
      this.socialSharer.shareWithOptions(options);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActivityDetailsPage');
  }

}
