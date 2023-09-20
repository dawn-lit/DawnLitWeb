import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { NgOptimizedImage } from "@angular/common";

// third party libraries
import { FormsModule } from "@angular/forms";
import { JwtModule } from "@auth0/angular-jwt";
import { AngularEditorModule } from '@kolkov/angular-editor';
import { OverlayscrollbarsModule } from "overlayscrollbars-ngx";
import { ProfileConnectionsComponent } from './profile-connections/profile-connections.component';
import { DROPZONE_CONFIG, DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

// apps
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
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
import { BlogComponent } from './blog/blog.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PasswordInputBoxComponent } from './password-input-box/password-input-box.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  acceptedFiles: 'image/*',
  headers: {"Authorization": 'Bearer ' + tokenGetter()},
  maxFilesize: 1048576
};

export function tokenGetter() {
  return localStorage.getItem("jwt_token");
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    LoginComponent,
    RegistrationComponent,
    SettingsComponent,
    LogoffComponent,
    AvatarComponent,
    ProfileComponent,
    PostsComponent,
    ProfileAboutComponent,
    MessagingComponent,
    ProfileConnectionsComponent,
    BlogComponent,
    PageNotFoundComponent,
    PasswordInputBoxComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
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
    OverlayscrollbarsModule,
    DropzoneModule,
    PickerComponent
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
