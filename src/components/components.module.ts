import {NgModule} from '@angular/core';
import {LoginFormComponent} from './login-form/login-form.component';
import {IonicModule} from "ionic-angular";
import {RegisterFormComponent} from './register-form/register-form.component';
import {ProfileComponent} from './profile/profile.component';
import {CreateCommunityFormComponent} from './create-community-form/create-community-form.component';
import {CommunitiesComponent} from "./communities/communities.component";
import {MembersComponent} from "./members/members.component";
import {ActivitiesComponent} from './activities/activities';
import {ActivityCreationFormComponent} from './activity-creation-form/activity-creation-form';
import {MemberOptionsComponent} from './member-options/member-options.component';
import {RankComponent} from './rank/rank';
import {PipesModule} from "../pipes/pipes.module";
import {ActivityMappingComponent} from './activity-mapping/activity-mapping';

@NgModule({
  declarations: [
    LoginFormComponent,
    RegisterFormComponent,
    ProfileComponent,
    CreateCommunityFormComponent,
    CommunitiesComponent,
    MembersComponent,
    ActivitiesComponent,
    ActivityCreationFormComponent,
    MemberOptionsComponent,
    RankComponent,
    ActivityMappingComponent
  ],
  imports: [IonicModule,
    PipesModule
  ],
  exports: [
    LoginFormComponent,
    RegisterFormComponent,
    ProfileComponent,
    CreateCommunityFormComponent,
    CommunitiesComponent,
    MembersComponent,
    ActivitiesComponent,
    ActivityCreationFormComponent,
    MemberOptionsComponent,
    RankComponent,
    ActivityMappingComponent,
  ]
})
export class ComponentsModule {
}
