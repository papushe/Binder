import {Component} from '@angular/core';
import {IonicPage, Loading, LoadingController, NavController} from 'ionic-angular';
import {CommunityService} from "../../providers/community-service/community.service";
import {Community} from "../../models/community/community.interface";

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
  loader: Loading;

  constructor(private communityService: CommunityService,
              private loading: LoadingController,
              private navCtrl: NavController) {

  }

  createLoader() {
    this.loader = null;
    this.loader = this.loading.create({
      content: `Searching Communities...`
    });
  }

  searchCommunity() {
    this.createLoader();
    this.loader.present().then(
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
              this.loader.dismiss();
            }
          );
      });
  }

  openCommunity(community) {
    this.navCtrl.push('CommunityDetailsPage', {community: community})
  }

}
