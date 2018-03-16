import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {UserService} from "../providers/user-service/user.service";
import {LoginPage} from "../pages/login/login";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: string;

  constructor(private userService: UserService,
              platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen) {

    this.userService.getAuthenticatedUser().subscribe(auth => {
      auth ? this.rootPage = 'TabsPage' : this.rootPage = 'LoginPage';
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

