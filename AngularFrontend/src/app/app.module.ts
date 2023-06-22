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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    WikiComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MarkdownModule.forRoot({loader: HttpClient}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
