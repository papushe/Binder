import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CreateCommunityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-community',
  templateUrl: 'create-community.html',
})
export class CreateCommunityPage {

  constructor(public navCtrl: NavController) {
  }

  ionViewDidLoad() {
  }

  saveCommunityResult(event){
    event ? this.navCtrl.setRoot('TabsPage') : console.log("Not Community saved")
  }

}
