import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-create-community',
  templateUrl: 'create-community.html',
})
export class CreateCommunityPage {

  constructor(private navCtrl: NavController) {
  }

  saveCommunityResult(event){
    event ? this.navCtrl.setRoot('CommunitiesPage') : console.log("Not Community saved")
  }

}
