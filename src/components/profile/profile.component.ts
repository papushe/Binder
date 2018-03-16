import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Profile} from "../../models/profile/profile.interface";
import {UserService} from "../../providers/user-service/user.service";
import {User} from "firebase/app";
import {Subscription} from 'rxjs/Subscription';
import {Loading, LoadingController, ModalController, NavParams, ToastController} from "ionic-angular";

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnDestroy, OnInit {

  profile = {} as Profile;
  skill: string = "";
  skills: any = [];
  hasProfile: boolean = false;
  authenticatedUser: User;
  authenticatedUser$: Subscription;
  // @Output() saveProfileResult: EventEmitter<any>;
  @Output() fromLoginPageEvent: EventEmitter<boolean>;
  loader: Loading;
  fromLoginPage:boolean;
  constructor(private loading: LoadingController,
              private toast: ToastController,
              private userService: UserService,
              private modalCtrl: ModalController,
              private navParams: NavParams) {
    // this.saveProfileResult = new EventEmitter<any>();
    this.authenticatedUser$ = this.userService.getAuthenticatedUser()
      .subscribe((user: User) => {
        this.authenticatedUser = user;
        this.getProfile(user);
      });
    this.fromLoginPageEvent = new EventEmitter<boolean>();
    this.fromLoginPage = this.navParams.get('where');
  }

  createLoader() {
    this.loader = this.loading.create({
      content: `Loading profile...`
    });
  }

  showAddressModal() {
    let modal = this.modalCtrl.create('AutocompletePage');
    let me = this;
    modal.onDidDismiss(data => {
      this.profile.location = data;
      console.log(data);
    });
    modal.present();
  }

  getProfile(user) {
    if (user) {
      this.createLoader();
      this.loader.present().then(() => {
        this.userService.getProfile(user)
          .subscribe(
            data => {
              if (data) {
                this.profile = <Profile>data;
                this.skills = this.profile.skills;
                console.log(`data: ${data}`);
                this.hasProfile = true;
              } else {
                console.log('no');
                this.hasProfile = false;
              }
            },
            err => {
              console.log(`error: ${err}`);
            },
            () => {
              console.log('done');
              this.loader.dismiss();
            }
          );
      });
    }
  }

  updateProfile() {
    this.userService.updateProfile(this.profile)
      .subscribe(
        data => {
          console.log(`data: ${data}`);
        },
        err => {
          this.toast.create({
            message: `Error: ${err}`,
            duration: 3000
          }).present();
        },
        () => {
          this.toast.create({
            message: `Profile updated successfully`,
            duration: 3000
          }).present();
        }
      );
  }

  dateOfBirthOptions: any = {
    buttons: [{
      text: 'Clear',
      handler: () => {
        this.profile.dateOfBirth = null;
      }
    }]
  };

  ngOnInit(): void {

  }

  saveProfile() {
    if (this.authenticatedUser) {
      this.profile.email = this.authenticatedUser.email;
      this.profile.keyForFirebase = this.authenticatedUser.uid;
      this.profile.skills = this.skills;
      this.userService.saveProfile(this.profile)
        .subscribe(
          data => {
            this.hasProfile = true;
            this.fromLoginPageEvent.emit(this.fromLoginPage);
            // this.saveProfileResult.emit(data);
            console.log(`data: ${data}`);
          },
          err => {
            this.toast.create({
              message: `Error: ${err}`,
              duration: 3000
            }).present();
          },
          () => {
            this.toast.create({
              message: `Profile saved successfully`,
              duration: 3000
            }).present();
          }
        );
    } else {
      this.hasProfile = false;
    }
  }

  cancelNew() {
    this.skill = "";
  }

  addItem(newItem: string) {
    if (newItem) {
      this.skills.push(newItem);
      this.skill = "";
    }
  }

  remove(removeItem) {
    this.skills.splice(removeItem, 1);
  }

  ngOnDestroy(): void {
    this.authenticatedUser$.unsubscribe();
  }
}
