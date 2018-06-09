import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Community} from "../../models/community/community.interface";
import {Profile} from "../../models/profile/profile.interface";
import {UserService} from "../../providers/user-service/user.service";
import {SharedService} from "../../providers/shared/shared.service";

@IonicPage()
@Component({
  selector: 'page-search-users',
  templateUrl: 'search-users.html',
})
export class SearchUsersPage implements OnInit {

  community: Community;
  profile: Profile;
  foundResults: boolean;
  query: string;
  noUsersFound: string = '';
  users: Profile[] = [];
  @ViewChild("messageInput") messageInput: ElementRef;


  constructor(private navParams: NavParams,
              private sharedService: SharedService,
              public userService: UserService,
              private navCtrl: NavController) {
  }

  ngOnInit(): void {
    this.init();
  }

  setInputFocus() {
    let elem: any = this.messageInput;
    elem._native.nativeElement.focus(); // Keep the focus on input field.
  }

  ngAfterViewChecked() {
    this.setInputFocus();
  }

  init() {
    this.community = this.navParams.get('community');
    this.profile = this.navParams.get('profile');
  }

  searchUsers() {
    if (this.query.trim() === '') {
      this.noUsersFound = '';
      this.users = [];
    }
    else {
      this.userService.searchUsers(this.query)
        .subscribe(
          data => {
            if (!data || data == 0) {
              this.foundResults = false;
              this.noUsersFound = 'No users found, try again';
              this.users = <Profile[]>data;
            }
            else {
              this.users = <Profile[]>data;
              this.foundResults = true;
              this.noUsersFound = '';
              // this.query = '';
            }
          },
          err => {
            console.log(`error: ${err.message}`);
          },
          () => {
            //done
          }
        );
    }
  }

  openOptions(user: Profile) {
    if (user.keyForFirebase != this.profile.keyForFirebase) {
      this.navCtrl.push('MemberOptionsPage', {member: user, community: this.community, isJoined: false})
    }
  }
}
