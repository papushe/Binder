import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {LoginResponse} from "../../models/login/login-response.interface";
import {UserService} from "../../providers/user-service/user.service";
import {User} from "firebase/app";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(private userService:UserService,
              private toast: ToastController,
              private navCtrl: NavController) {
  }


  login(event:LoginResponse){
    if(!event.error){
      this.toast.create({
        message:`Welcome to Binder, ${event.result.email}`,
        duration:3000
      }).present();

      this.userService.getProfile(<User>event.result)
        .subscribe(profile=>{
          console.log(profile);
          profile ? this.navCtrl.setRoot("TabsPage") : this.navCtrl.setRoot('ProfilePage');
        });


    } else{
      this.toast.create({
        message: event.error.message,
        duration:3000
      }).present();
    }
  }

}
