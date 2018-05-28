import { Injectable } from '@angular/core';
import { Push, PushObject, PushOptions } from '@ionic-native/push';


/*
  Generated class for the PushService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PushService {

  pushObject: PushObject;
  permission: boolean = false;

  constructor(private push: Push) {
  }

  initialize(FirebaseKey) {
    this.push.hasPermission()
      .then((res: any) => {
        this.permission = res.isEnabled;

        if (this.permission) {
          this.createChannel(FirebaseKey).then(() => {
            const options: PushOptions = {
              android: {},
              ios: {
                alert: 'true',
                badge: true,
                sound: 'false'
              },
              windows: {},
              browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
              }
            };

            this.pushObject = this.push.init(options);
            this.pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
          })
        }
      }).catch(err => {
        console.log(`pushService cannot be initialized: ${err}`);
    })
  }

  createChannel(FirebaseKey) {
    return this.push.createChannel({
      id: FirebaseKey,
      description: `${FirebaseKey} channel`,
      // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
      importance: 3
    });
  }


  cleanBadge() {
    if(this.permission) {
    this.pushObject.clearAllNotifications()
      .then(() => {})
    }
  }

  sendPushNotification() {
        if (this.permission) {
          this.pushObject.getApplicationIconBadgeNumber()
            .then(count => {
              this.pushObject.setApplicationIconBadgeNumber(count + 1).then(() => {

              })
            })
        } else {
          console.log('We do not have permission to send push notifications');
        }
  }

}
