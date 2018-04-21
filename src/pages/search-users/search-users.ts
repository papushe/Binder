import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Community} from "../../models/community/community.interface";
import {Profile} from "../../models/profile/profile.interface";
import {UserService} from "../../providers/user-service/user.service";
import {SharedService} from "../../providers/shared/shared.service";

/**
 * Generated class for the SearchUsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-users',
  templateUrl: 'search-users.html',
})
export class SearchUsersPage {

  community: Community;
  profile: Profile;
  foundResults: boolean;
  query: string;
  noUsersFound: string;
  users: Profile[] = [];


  constructor(private navParams: NavParams,
              private shared: SharedService,
              private userService: UserService,
              private navCtrl: NavController) {
    this.community = this.navParams.get('community');
    this.profile = this.navParams.get('profile');
  }

  searchUsers() {
    this.shared.createLoader('Searching Users...');
    this.shared.loader.present().then(
      () => {
        this.userService.searchUsers(this.query)
          .subscribe(
            data => {
              if (!data || data == 0) {
                this.foundResults = false;
                this.noUsersFound = 'No users found, try again';
              }
              else {
                this.users = <Profile[]>data;
                this.foundResults = true;
                this.noUsersFound = '';
                this.query = '';
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
  openOptions(user: Profile) {
    if (user.keyForFirebase != this.profile.keyForFirebase) {
      this.navCtrl.push('MemberOptionsPage', {member: user, community: this.community, isJoined: false})
    }
  }
}
