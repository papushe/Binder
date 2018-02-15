import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import {MESSAGE_LIST} from "../../mocks/messages/messages";
import {Message} from "../../models/messages/message.interface";
import {CreateCommunityPage} from "../create-community/create-community";

/**
 * Generated class for the InboxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-communities',
  templateUrl: 'communities.html',
})
export class CommunitiesPage {

  // messageList:Message[] = MESSAGE_LIST;

  constructor(private navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

  }

  createCommunity(){
    this.navCtrl.push('CreateCommunityPage');
  }

}
