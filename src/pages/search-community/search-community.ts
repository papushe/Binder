import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {CommunityService} from "../../providers/community-service/community.service";
import {Community} from "../../models/community/community.interface";

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
  showSpinner: boolean;
  @ViewChild("messageInput") messageInput: ElementRef;


  constructor(public communityService: CommunityService,
              private navCtrl: NavController) {

  }

  setInputFocus() {
    let elem: any = this.messageInput;
    elem._native.nativeElement.focus(); // Keep the focus on input field.
  }

  ngAfterViewChecked() {
    // this.setInputFocus();
  }

  searchCommunity() {
    if (this.search.trim() === '') {
      this.noCommunityFound = '';
      this.searchCommunities = [];
    } else {
      this.showSpinner = true;
      this.communityService.searchCommunity(this.search)
        .subscribe(
          data => {
            if (!data || data == 0) {
              this.hasCommunity = false;
              this.noCommunityFound = 'No communities found, try again';
            } else {
              this.searchCommunities = <Community[]>data;
              this.hasCommunity = true;
              this.noCommunityFound = '';
            }
          },
          err => {
            //console.log(`error: ${err.message}`);
          },
          () => {
            //done
            this.showSpinner = false;
          }
        );
    }
  }

  openCommunity(community) {
    this.navCtrl.push('CommunityDetailsPage', {community: community, from: 'searchPage'})
  }
}
