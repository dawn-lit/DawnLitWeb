import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { WikiComponent } from './wiki/wiki.component';

// third party libraries
import { MarkdownModule } from 'ngx-markdown';
import { NavigationComponent } from './navigation/navigation.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { FormsModule } from "@angular/forms";
import { JwtModule } from "@auth0/angular-jwt";
import { SettingsComponent } from './settings/settings.component';

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
    SettingsComponent
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
