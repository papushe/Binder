import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Activity} from "../../models/activity/activity.interface";

/**
 * Generated class for the LiveActivityInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-live-activity-info',
  templateUrl: 'live-activity-info.html',
})
export class LiveActivityInfoPage {

  activity: Activity;

  constructor(private navCtrl: NavController,
              private navParams: NavParams) {
    this.activity = this.navParams.get('activity');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LiveActivityInfoPage');
  }

}
