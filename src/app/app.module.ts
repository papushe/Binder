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
import {ActivityService} from '../providers/activity-service/activity-service';
import {Camera} from '@ionic-native/camera';
import {Calendar} from '@ionic-native/calendar';
import {SharedService} from '../providers/shared/shared.service';

import {SocketIoModule, SocketIoConfig} from 'ng-socket-io';
import {AuthInterceptor} from '../providers/interceptors-auth/interceptors-auth';
import {HTTP_INTERCEPTORS} from "@angular/common/http";

import {SocketService} from '../providers/socket/socket.service';
import {ChatService} from '../providers/chat-service/chat-service';
import {NotificationService} from '../providers/notitfication/notification.service';
import {MessageService} from '../providers/message/message';
import {CalendarService} from '../providers/calendar-service/calendar-service';

// const config: SocketIoConfig = {url: 'http://localhost:4300', options: {}};
const config: SocketIoConfig = {url: 'https://appbinder.herokuapp.com', options: {}};

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
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserService,
    CommunityService,
    ActivityService,
    Camera,
    Calendar,
    SharedService,
    SocketService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    ChatService,
    NotificationService,
    MessageService,
    CalendarService
  ]
})
export class AppModule {
}
