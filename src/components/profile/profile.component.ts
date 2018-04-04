import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Profile} from "../../models/profile/profile.interface";
import {UserService} from "../../providers/user-service/user.service";
import {User} from "firebase/app";
import {Subscription} from 'rxjs/Subscription';
import {AlertController, Loading, LoadingController, ModalController, NavParams, ToastController} from "ionic-angular";
import {Camera, CameraOptions} from '@ionic-native/camera';
import firebase from 'firebase';

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
  fromLoginPage: boolean;

  myPhotosRef: any;
  myPhoto: any;
  myPhotoURL: any;
  showLoader:boolean=false;

  constructor(private loading: LoadingController,
              private toast: ToastController,
              private userService: UserService,
              private modalCtrl: ModalController,
              private navParams: NavParams,
              private alertCtrl: AlertController,
              private camera: Camera) {
    // this.saveProfileResult = new EventEmitter<any>();
    this.authenticatedUser$ = this.userService.getAuthenticatedUser()
      .subscribe((user: User) => {
        this.authenticatedUser = user;
        this.getProfile(user);
        this.loadAndInitPhoto();
      });
    this.fromLoginPageEvent = new EventEmitter<boolean>();
    this.fromLoginPage = this.navParams.get('where');
  }

  loadAndInitPhoto() {
    this.myPhotosRef = firebase.storage().ref(`/Photos/`);

    this.myPhotosRef.child(`${this.authenticatedUser.uid}.png`).getDownloadURL().then((url) => {

      console.log(url);
      this.myPhotoURL = url

    }).catch((error) => {
      switch (error.code) {
        case 'storage/object_not_found':
          // File doesn't exist
          break;

        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;

        case 'storage/canceled':
          // User canceled the upload
          break;


        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          break;
      }
    })
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

  signOut() {
    this.userService.signOut();
  }

  deleteProfilePopup() {
    let alert = this.alertCtrl.create({
      title: 'Delete Account',
      message: 'Do you Really want to delete your Account? Enter your password first',
      inputs: [
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: data => {
            this.userService.deleteFromFirebase(this.authenticatedUser, data.password);
          }
        }
      ]
    });
    alert.present();
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
    this.showLoader = true;
    this.myPhotosRef.child(`${this.authenticatedUser.uid}.png`)
      .putString(this.myPhoto, 'base64', {contentType: 'image/png'})
      .then((savedPicture) => {
        this.showLoader = false;
        this.myPhotoURL = savedPicture.downloadURL;
      });
  }

}
