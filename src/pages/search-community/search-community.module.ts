import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchCommunityPage } from './search-community';

@NgModule({
  declarations: [
    SearchCommunityPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchCommunityPage),
  ],
})
export class SearchCommunityPageModule {}
