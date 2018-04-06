import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {CommunityService} from "../../providers/community-service/community.service";
import {Community} from "../../models/community/community.interface";
import {SharedService} from "../../providers/shared/shared";

@IonicPage()
@Component({
  selector: 'page-search-community',
  templateUrl: 'search-community.html',
})
export class SearchCommunityPage {

  search: string = '';
  communities: Community[] = [];
  hasCommunity: boolean = false;
  noCommunityFound: string = '';

  constructor(private communityService: CommunityService,
              private navCtrl: NavController,
              private shared: SharedService) {

  }

  searchCommunity() {
    this.shared.createLoader('Searching Communities...');
    this.shared.loader.present().then(
      () => {
        this.communityService.searchCommunity(this.search)
          .subscribe(
            data => {
              if (data == 0) {
                this.hasCommunity = false;
                this.noCommunityFound = 'no communities found, try again..';
              } else {
                this.communities = <Community[]>data;
                this.hasCommunity = true;
                this.noCommunityFound = '';
                this.search = '';
              }
            },
            err => {
              console.log(`error: ${err}`);
            },
            () => {
              console.log('done');
              this.shared.loader.dismiss();
            }
          );
      });
  }

  openCommunity(community) {
    this.navCtrl.push('CommunityDetailsPage', {community: community})
  }
}
