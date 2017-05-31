import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DetailsProvider } from '../../providers/details-provider';
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

  private userData: any = [];

  private creatorName: any = "";

  private creatorID: any = "";

  private activityTime: any = "";

  private locationName: any = "";

  private participants: any = [];

  private attendees: any = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, public dProvider: DetailsProvider) {
    this.activityData = this.navParams.get('activityItem');
    console.log(this.activityData);
    this.prepareItemData();
  }

  prepareItemData(){
    this.creatorID = this.activityData.creator;
    this.activityTime = this.activityData.date;
    this.locationName = this.activityData.locationName;
    let participantsTemp = this.activityData.attendees;

    for(let p in participantsTemp){
      let tmp = {
        id: p
      }
      this.participants.push(tmp);
    }

    console.log(this.participants);
    this.getUserData();
    this.getAttendeeData();
  }

  getUserData(){
    let thatIs = this;
    this.dProvider.setUserData(this.creatorID).then(function(){
      thatIs.userData = thatIs.dProvider.userData;
      thatIs.defineActivityItems();
    });
  }

  getAttendeeData(){
    let thatIs = this;
    for(let p of this.participants){
      let id = p.id;
      this.dProvider.setUserData(id).then(function(){
        thatIs.userData = thatIs.dProvider.userData;
        let data = {
          name: thatIs.userData[0].name,
          age: thatIs.userData[0].age
        }
        thatIs.attendees.push(data);
      })
    }
  }

  defineActivityItems(){
    this.creatorName = this.userData[0].name;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActivityDetailsPage');
  }

}
