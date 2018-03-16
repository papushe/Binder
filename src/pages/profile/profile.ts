import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UserService} from "../../providers/user-service/user.service";

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(private userService:UserService,
              private navCtrl: NavController) {
  }


  saveProfileResult(event){
    event ? this.navCtrl.setRoot('TabsPage') : console.log("Not authenticated or saved");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  signOut(){
    this.userService.signOut();
    // this.navCtrl.setRoot('LoginPage');
  }

}
