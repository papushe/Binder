import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {AngularFireModule} from 'angularfire2'
import {MyApp} from './app.component';
import {Geolocation} from '@ionic-native/geolocation';
import {FIREBASE_CONFIG} from "./app.firebase.config";
import {UserService} from "../providers/user-service/user.service";
import {AngularFireAuthModule} from "angularfire2/auth";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {HttpClientModule} from "@angular/common/http";
import {CommunityService} from '../providers/community-service/community.service';
import {FormsModule} from "@angular/forms";
import {ActivityServiceProvider} from '../providers/activity-service/activity-service';
import {Camera} from '@ionic-native/camera';
import {SharedService} from '../providers/shared/shared.service';
import {ProfilePopoverComponent} from "../components/profile-popover/profile-popover.component";
import {ProfilePopoverComponentModule} from "../components/profile-popover/profile-popover.component.module";
import {CommunityPopoverComponentModule} from "../components/community-popover/community-popover.component.module";

import {SocketIoModule, SocketIoConfig} from 'ng-socket-io';
import { SocketService } from '../providers/socket/socket.service';
const config: SocketIoConfig = {url: 'http://localhost:4300', options: {}};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(MyApp),
    SocketIoModule.forRoot(config),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    HttpClientModule,
    ProfilePopoverComponentModule,
    CommunityPopoverComponentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilePopoverComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserService,
    CommunityService,
    ActivityServiceProvider,
    Camera,
    SharedService,
    SocketService
  ]
})
export class AppModule {
}
