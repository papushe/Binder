import { NgModule } from '@angular/core';
import { LoginFormComponent } from './login-form/login-form.component';
import {IonicModule} from "ionic-angular";
import { RegisterFormComponent } from './register-form/register-form.component';
import { ProfileComponent } from './profile/profile.component';
@NgModule({
	declarations: [
	  LoginFormComponent,
    RegisterFormComponent,
    ProfileComponent
  ],
	imports: [IonicModule],
	exports: [
	  LoginFormComponent,
    RegisterFormComponent,
    ProfileComponent
  ]
})
export class ComponentsModule {}
