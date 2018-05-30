import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Community} from "../../models/community/community.interface";
import {Activity} from "../../models/activity/activity.interface";

@IonicPage()
@Component({
  selector: 'page-create-activity',
  templateUrl: 'create-activity.html',
})
export class CreateActivityPage implements OnInit {

  community: Community;
  activity: Activity;

  constructor(private navCtrl: NavController,
              private navParams: NavParams) {
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.community = this.navParams.get('community');
    this.activity = this.navParams.get('activity');
  }

  saveActivityResult(event) {
    event ? this.navCtrl.pop() : '';
  }
}
