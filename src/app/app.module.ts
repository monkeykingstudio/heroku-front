import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CounterComponent } from './counters/counter/counter.component';
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
import { ColonyHeaderComponent } from './colonies/colony-header/colony-header.component';
import { ColonySpeciesBannerComponent } from './colonies/colony-species-banner/colony-species-banner.component';
import { TaskManagerComponent } from './task-manager/task-manager.component';
import { TaskCreatorComponent } from './task-manager/task-creator/task-creator.component';
import { TaskListComponent } from './task-manager/task-list/task-list.component';
import { TaskComponent } from './task-manager/task/task.component';
import { BreedSheetCreatorComponent } from './breed-sheet-creator/breed-sheet-creator.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { BreedSheetViewerComponent } from './breed-sheet-viewer/breed-sheet-viewer.component';
import { BreedSheetListComponent } from './breed-sheet-list/breed-sheet-list.component';
import { ProductsComponent } from './products/products.component';
import { BreedCardComponent } from './breed-card/breed-card.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

import { SocketioService } from './services/socketio.service';

import { ChartsModule } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import { EditorModule } from '@tinymce/tinymce-angular';
import HtmlPipe from './pipes/html.pipe';
import { AlphaPipe } from './pipes/AlphaPipe';
import { ApprovedPipe } from './pipes/ApprovedPipe';
import { NgxSimpleCountdownModule } from 'ngx-simple-countdown';
import { ClickoutsideDirective } from './clickoutside.directive';

@NgModule({
  declarations: [
    AppComponent,
    CounterComponent,
    ColonyCardComponent,
    ColoniesListComponent,
    ColonyComponent,
    HeaderComponent,
    LateralMenuComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    ActivationComponent,
    ColonyHeaderComponent,
    ColonySpeciesBannerComponent,
    TaskManagerComponent,
    TaskCreatorComponent,
    TaskListComponent,
    TaskComponent,
    BreedSheetCreatorComponent,
    AdminPanelComponent,
    BreedSheetViewerComponent,
    BreedSheetListComponent,
    ProductsComponent,
    HtmlPipe,
    BreedCardComponent,
    AlphaPipe,
    ApprovedPipe,
    LandingPageComponent,
    ClickoutsideDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PopupModule,
    BrowserAnimationsModule,
    NgbModule,
    ChartsModule,
    EditorModule,
    NgxSimpleCountdownModule
  ],
  providers: [
    SocketioService,
    DatePipe,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
