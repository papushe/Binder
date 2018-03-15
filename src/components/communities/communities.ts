import {Component} from '@angular/core';
import {User} from "firebase/app";
import {Subscription} from "rxjs/Subscription";
import {UserService} from "../../providers/user-service/user.service";
import {CommunityService} from "../../providers/community-service/community.service";
import {Community} from "../../models/community/community.interface";

@Component({
  selector: 'communities-component',
  templateUrl: 'communities.component.html'
})
export class CommunitiesComponent {

  authenticatedUser: User;
  authenticatedUser$: Subscription;
  communities: Community;

  constructor(private userService: UserService,
              private communityService: CommunityService) {

    this.authenticatedUser$ = this.userService.getAuthenticatedUser()
      .subscribe((user: User) => {
        this.authenticatedUser = user;
        this.getCommunities(user);
      });
  }

  getCommunities(user) {
    this.communityService.getCommunities(user)
      .subscribe(
        data => {
          if (data) {
            this.communities = <Community>data;
            console.log(`data: ${data}`);
          } else {
            console.log('no');
          }
        },
        err => {
          console.log(`error: ${err}`);
        },
        () => {
          console.log('done');
        }
      );
  }
}
