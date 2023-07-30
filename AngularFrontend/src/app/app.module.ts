import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgOptimizedImage } from "@angular/common";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { WikiComponent } from './wiki/wiki.component';
import { SettingsComponent } from './settings/settings.component';
import { LogoffComponent } from './logoff/logoff.component';
import { AvatarComponent } from './avatar/avatar.component';
import { ProfileComponent } from './profile/profile.component';
import { PostsComponent } from './posts/posts.component';
import { ProfileAboutComponent } from './profile-about/profile-about.component';
import { MessagingComponent } from './messaging/messaging.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';

// third party libraries
import { MarkdownModule } from 'ngx-markdown';
import { FormsModule } from "@angular/forms";
import { JwtModule } from "@auth0/angular-jwt";
import { AngularEditorModule } from '@kolkov/angular-editor';
import { OverlayscrollbarsModule } from "overlayscrollbars-ngx";
import { ProfileConnectionsComponent } from './profile-connections/profile-connections.component';

export function tokenGetter() {
  return localStorage.getItem("jwt_token");
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    WikiComponent,
    LoginComponent,
    RegistrationComponent,
    SettingsComponent,
    LogoffComponent,
    AvatarComponent,
    ProfileComponent,
    PostsComponent,
    ProfileAboutComponent,
    MessagingComponent,
    ProfileConnectionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MarkdownModule.forRoot({loader: HttpClient}),
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:7061"],
        disallowedRoutes: []
      }
    }),
    NgOptimizedImage,
    AngularEditorModule,
    OverlayscrollbarsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
