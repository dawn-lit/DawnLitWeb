import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { WikiComponent } from './wiki/wiki.component';
import { LoginComponent } from './login/login.component';
import { LogoffComponent } from './logoff/logoff.component';
import { RegistrationComponent } from './registration/registration.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from "./profile/profile.component";
import { MessagingComponent } from "./messaging/messaging.component";
import { BlogComponent } from "./blog/blog.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'logoff', component: LogoffComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'wiki', component: WikiComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'messaging', component: MessagingComponent},
  {path: 'blog', component: BlogComponent},
  {path: '**', pathMatch: 'full', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
