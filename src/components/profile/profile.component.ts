import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Profile} from "../../models/profile/profile.interface";
import {UserService} from "../../providers/user-service/user.service";
import {AlertController, ModalController, NavParams, ToastController} from "ionic-angular";
import {Camera, CameraOptions} from '@ionic-native/camera';
import firebase from 'firebase';
import {SharedService} from "../../providers/shared/shared.service";

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnDestroy, OnInit {

  profile = {} as Profile;
  skill: string = "";
  skills: any = [];
  hasProfile: boolean = false;
  @Output() fromLoginPageEvent: EventEmitter<boolean>;
  fromLoginPage: boolean;

  myPhotosRef: any;
  myPhoto: any;
  showLoader: boolean = false;
  hasProfilePicAbdUploadNew: boolean = false;

  constructor(private toast: ToastController,
              private userService: UserService,
              private modalCtrl: ModalController,
              private navParams: NavParams,
              private alertCtrl: AlertController,
              private camera: Camera,
              private shared: SharedService) {

    if (this.userService.thisProfile) {
      this.profile = this.userService.thisProfile;
      this.skills = this.userService.thisProfile.skills;
      this.hasProfile = true;
      this.myPhotosRef = firebase.storage().ref(`/Photos/`);
    } else {
      this.hasProfile = false;
    }

    this.fromLoginPageEvent = new EventEmitter<boolean>();
    this.fromLoginPage = this.navParams.get('where');
  }

  getProfile(user) {
    if (user) {
      this.shared.createLoader('Loading Profile..');
      this.shared.loader.present().then(() => {
        this.userService.getProfile(user)
          .subscribe(
            data => {
              if (data) {
                this.userService.thisProfile = <Profile>data;
                this.profile = this.userService.thisProfile;
                this.skills = this.userService.thisProfile.skills;
                this.hasProfile = true;
                this.fromLoginPageEvent = new EventEmitter<boolean>();
                this.fromLoginPage = this.navParams.get('where');
              } else {
                this.hasProfile = false;
              }
            },
            err => {
              console.log(`error: ${err.message}`);
            },
            () => {
              //done
              this.shared.loader.dismiss();
            }
          );
      });
    }
  }

  showAddressModal() {
    let modal = this.modalCtrl.create('AutocompletePage');
    let me = this;
    modal.onDidDismiss(data => {
      this.profile.location = data;
    });
    modal.present();
  }


  updateProfile() {
    this.shared.createLoader('Updating profile..');
    this.shared.loader.present().then(() => {
      this.userService.updateProfile(this.profile)
        .subscribe(
          data => {
            this.userService.thisProfile = <Profile>data;
            this.userService.thisHasProfile = true;
          },
          err => {
            this.toast.create({
              message: `Error: ${err.message}`,
              duration: 3000
            }).present();
          },
          () => {
            this.shared.loader.dismiss();
            this.toast.create({
              message: `Profile updated successfully`,
              duration: 3000
            }).present();
          }
        );
    })
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
    if (this.userService.thisAuthenticatedUser) {
      this.profile.email = this.userService.thisAuthenticatedUser.email;
      this.profile.keyForFirebase = this.userService.thisAuthenticatedUser.uid;
      this.profile.skills = this.skills;
      this.shared.createLoader('Saving profile..');
      this.shared.loader.present().then(() => {
        this.userService.saveProfile(this.profile)
          .subscribe(
            data => {
              this.hasProfile = true;
              this.userService.thisProfile = <Profile>data;
              this.userService.thisHasProfile = true;
              this.fromLoginPageEvent.emit(this.fromLoginPage);
            },
            err => {
              this.toast.create({
                message: `Error: ${err.message}`,
                duration: 3000
              }).present();
              this.userService.thisHasProfile = false;
            },
            () => {
              this.shared.loader.dismiss();
              this.toast.create({
                message: `Profile saved successfully`,
                duration: 3000
              }).present();
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
    if (this.profile.profilePic) {
      this.hasProfilePicAbdUploadNew = true;
    }
    this.showLoader = true;
    this.myPhotosRef.child(`${this.userService.thisAuthenticatedUser.uid}.png`)
      .putString(this.myPhoto, 'base64', {contentType: 'image/png'})
      .then((savedPicture) => {
        this.hasProfilePicAbdUploadNew = false;
        this.showLoader = false;
        this.userService.thisProfile.profilePic = savedPicture.downloadURL;
        this.profile.profilePic = this.userService.thisProfile.profilePic;
      });
  }
}
