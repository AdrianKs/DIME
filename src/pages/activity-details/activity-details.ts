import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DetailsProvider } from '../../providers/details-provider';
import { ProfilePage } from '../profile/profile';
import { Utilities } from "../../app/utilities";
import firebase from 'firebase';
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


  constructor(public navCtrl: NavController, public navParams: NavParams, public dProvider: DetailsProvider, public utilities: Utilities) {
    this.activityData = this.navParams.get('activityItem');
    console.log(this.activityData);
    this.prepareItemData();
  }

  prepareItemData() {
    this.userID = this.utilities.user.uid;
    console.log("my userID: " + this.userID);
    this.creatorID = this.activityData.creator;

    this.checkEventCreator();



    this.activityTime = this.activityData.date;
    this.locationName = this.activityData.locationName;
    this.description = this.activityData.description;
    this.activityID = this.activityData.id;
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
            name: thatIs.userData[0].name,
            minAge: thatIs.userData[0].minAge,
            picURL: thatIs.userData[0].picURL
          }
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActivityDetailsPage');
  }

}
