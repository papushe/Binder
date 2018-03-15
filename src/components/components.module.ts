import { NgModule } from '@angular/core';
import { LoginFormComponent } from './login-form/login-form.component';
import {IonicModule} from "ionic-angular";
import { RegisterFormComponent } from './register-form/register-form.component';
import { ProfileComponent } from './profile/profile.component';
import { CreateCommunityFormComponent } from './create-community-form/create-community-form.component';
import { CommunitiesComponent } from './communities/communities.component';
@NgModule({
	declarations: [
	  LoginFormComponent,
    RegisterFormComponent,
    ProfileComponent,
    CreateCommunityFormComponent,
    CommunitiesComponent,
  ],
	imports: [IonicModule],
	exports: [
	  LoginFormComponent,
    RegisterFormComponent,
    ProfileComponent,
    CreateCommunityFormComponent,
    CommunitiesComponent,
  ]
})
export class ComponentsModule {}
