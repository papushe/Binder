import {Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {Profile} from "../../models/profile/profile.interface";
import {UserService} from "../../providers/user-service/user.service";
import {ModalController, NavParams} from "ionic-angular";
import {Camera, CameraOptions} from '@ionic-native/camera';
import firebase from 'firebase';
import {SharedService} from "../../providers/shared/shared.service";

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnDestroy {

  skill: string = "";
  skills: any = [];
  hasProfile: boolean = false;
  @Output() fromLoginPageEvent: EventEmitter<boolean>;
  fromLoginPage: boolean;

  myPhotosRef: any;
  myPhoto: any;
  showLoader: boolean = false;

  constructor(public userService: UserService,
              private modalCtrl: ModalController,
              private navParams: NavParams,
              private camera: Camera,
              private sharedService: SharedService) {

    if (Object.keys(this.userService.thisProfile) && Object.keys(this.userService.thisProfile).length !== 0) {
      this.skills = this.userService.thisProfile.skills;
      this.myPhotosRef = firebase.storage().ref(`/Photos/`);
    }
    this.hasProfile = this.userService.thisHasProfile;
    this.fromLoginPageEvent = new EventEmitter<boolean>();
    this.fromLoginPage = this.navParams.get('where');
  }

  getProfile(user) {
    if (user) {
      this.sharedService.createLoader('Loading Profile..');
      this.sharedService.loader.present().then(() => {
        this.userService.getProfile(user)
          .subscribe(
            data => {
              if (data) {
                if (Object.keys(<Profile>data) && Object.keys(<Profile>data).length !== 0) {
                  this.userService.thisProfile = <Profile>data;
                  this.skills = this.userService.thisProfile.skills;
                  this.userService.thisHasProfile = true;
                  this.hasProfile = this.userService.thisHasProfile;
                  this.fromLoginPageEvent.emit(true);
                  this.fromLoginPage = this.navParams.get('where');
                } else {
                  this.userService.thisHasProfile = false;
                  this.hasProfile = this.userService.thisHasProfile;
                  this.fromLoginPageEvent.emit(false);
                }
              } else {
                this.userService.thisHasProfile = false;
                this.hasProfile = this.userService.thisHasProfile;
                this.fromLoginPageEvent.emit(false);
              }
            },
            err => {
              console.log(`Error occurred when tried to get profile: ${err.message}`);
            },
            () => {
              //done
              this.sharedService.loader.dismiss();
            }
          );
      });
    }
  }

  showAddressModal() {
    let modal = this.modalCtrl.create('AutocompletePage');
    modal.onDidDismiss(data => {
      this.userService.thisProfile.location = data;
    });
    modal.present();
  }

  updateProfile() {
    this.sharedService.createLoader('Updating profile..');
    this.sharedService.loader.present().then(() => {
      this.userService.updateProfile(this.userService.thisProfile)
        .subscribe(
          data => {
            if (data) {
              this.userService.thisProfile = <Profile>data;
              this.userService.thisHasProfile = true;
              this.sharedService.createToast(`Profile updated successfully`);
            }
          },
          err => {
            this.sharedService.createToast(`Error occurred when tried to update profile`);
            console.log(`Error occurred when tried to update profile: ${err.message}`);
          },
          () => {
            this.sharedService.loader.dismiss();
          }
        );
    })
  }

  dateOfBirthOptions: any = {
    buttons: [{
      text: 'Clear',
      handler: () => {
        this.userService.thisProfile.dateOfBirth = null;
      }
    }]
  };

  saveProfile() {
    if (this.userService.thisAuthenticatedUser) {
      this.userService.thisProfile.email = this.userService.thisAuthenticatedUser.email;
      this.userService.thisProfile.keyForFirebase = this.userService.thisAuthenticatedUser.uid;
      this.userService.thisProfile.skills = this.skills;
      this.sharedService.createLoader('Saving profile..');
      this.sharedService.loader.present().then(() => {
        this.userService.saveProfile(this.userService.thisProfile)
          .subscribe(
            data => {
              if (data) {
                this.userService.thisHasProfile = true;
                this.hasProfile = this.userService.thisHasProfile;
                this.userService.thisProfile = <Profile>data;
                this.fromLoginPageEvent.emit(this.fromLoginPage);
              }
            },
            err => {
              this.sharedService.createToast(`Error: ${err.message}`);
              this.userService.thisHasProfile = false;
            },
            () => {
              this.sharedService.loader.dismiss();
              this.sharedService.createToast(`Profile saved successfully`);
            }
          );
      });
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
    this.userService.thisAuthenticatedUser$.unsubscribe();
  }

  // ************************ Add picture ************************

  takePhoto() {
    const options: CameraOptions = {
      quality: 50,
      targetWidth: 100,
      targetHeight: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.PNG,
      correctOrientation: true,
      saveToPhotoAlbum: true,
      allowEdit: true
    };

    this.camera.getPicture(options).then(imageData => {
      this.myPhoto = imageData;
      this.uploadPhoto();
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }

  selectPhoto() {
    const options: CameraOptions = {
      quality: 50,
      targetWidth: 100,
      targetHeight: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.PNG,
      correctOrientation: true,
      allowEdit: true
    };
    this.camera.getPicture(options)
      .then(imageData => {
        this.myPhoto = imageData;
        this.uploadPhoto();
      }, error => {
        console.log("ERROR -> " + JSON.stringify(error));
      });
  }

  uploadPhoto(): void {
    this.showLoader = true;
    this.myPhotosRef.child(`${this.userService.thisAuthenticatedUser.uid}.png`)
      .putString(this.myPhoto, 'base64', {contentType: 'image/png'})
      .then((savedPicture) => {
        this.userService.thisProfile.profilePic = savedPicture.downloadURL;
        this.showLoader = false;
      });
  }
}
