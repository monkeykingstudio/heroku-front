import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './auth/error-interceptor';
import { HeaderComponent } from './header/header.component';
import { LateralMenuComponent } from './lateral-menu/lateral-menu.component';
import { LoginComponent } from '../app/auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ActivationComponent } from './auth/activation/activation.component';
import { HomeComponent } from './home/home.component';
import { PopupModule } from './popup/popup.module';
import { ColonyCardComponent } from './colonies/colony-card/colony-card.component';
import { ColoniesListComponent } from './colonies/colonies-list/colonies-list.component';
import { ColonyComponent } from './colonies/colony/colony.component';

@NgModule({
  declarations: [
    AppComponent,
    ColonyCardComponent,
    ColoniesListComponent,
    ColonyComponent,
    HeaderComponent,
    LateralMenuComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    ActivationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PopupModule,
    BrowserAnimationsModule,
    NgbModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
