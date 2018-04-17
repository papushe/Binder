import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {UserService} from "../providers/user-service/user.service";
import {LoginPage} from "../pages/login/login";
import {SharedService} from "../providers/shared/shared.service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: string;

  constructor(private userService: UserService,
              private sharedService: SharedService,
              platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen) {

    this.userService.thisAuthenticatedUser$ = this.userService.getAuthenticatedUser().subscribe(auth => {
      if (!auth) {
        this.rootPage =  'LoginPage';
      }
      else {
        this.userService.thisAuthenticatedUser = auth;
        auth.getIdToken()
          .then(token => {
            this.sharedService.storeToken(token);
            this.rootPage = 'TabsPage';
          })
          .catch(err => {
            console.log(`Initialization error: ${err.message}`);
            this.rootPage = 'LoginPage';
          });
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

