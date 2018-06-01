import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {CommunityService} from "../../providers/community-service/community.service";
import {Community} from "../../models/community/community.interface";
import {SharedService} from "../../providers/shared/shared.service";

@IonicPage()
@Component({
  selector: 'page-search-community',
  templateUrl: 'search-community.html',
})
export class SearchCommunityPage {

  search: string = '';
  noCommunityFound: string = '';
  searchCommunities: Community[] = [];
  hasCommunity: boolean = false;

  constructor(public communityService: CommunityService,
              private navCtrl: NavController,
              private sharedService: SharedService) {

  }

  searchCommunity() {
    this.sharedService.createLoader('Searching Communities...');
    this.sharedService.loader.present().then(
      () => {
        this.communityService.searchCommunity(this.search)
          .subscribe(
            data => {
              if (!data || data == 0) {
                this.hasCommunity= false;
                this.noCommunityFound = 'No communities found, try again';
              } else {
                this.searchCommunities = <Community[]>data;
                this.hasCommunity = true;
                this.noCommunityFound = '';
                this.search = '';
              }
            },
            err => {
              console.log(`error: ${err.message}`);
            },
            () => {
              //done
              this.sharedService.loader.dismiss();
            }
          );
      });
  }

  openCommunity(community) {
    this.navCtrl.push('CommunityDetailsPage', {community: community, from: 'searchPage'})
  }
}
