import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ColoniesListComponent } from './colonies/colonies-list/colonies-list.component';
import { ColonyComponent } from './colonies/colony/colony.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ActivationComponent } from './auth/activation/activation.component';
import { BreedSheetCreatorComponent } from './breed-sheet-creator/breed-sheet-creator.component';
import { BreedSheetViewerComponent } from './breed-sheet-viewer/breed-sheet-viewer.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { ProductsComponent } from './products/products.component';
import { BreedSheetListComponent } from './breed-sheet-list/breed-sheet-list.component';
import { LandingPageComponent } from './landing-page/landing-page.component';



import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'concours', component: LandingPageComponent },
  { path: 'adminpanel', component: AdminPanelComponent, canActivate: [RoleGuard, AuthGuard] },
  { path: 'breedsheetcreator', component: BreedSheetCreatorComponent, canActivate: [AuthGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
  { path: 'breedsheetlist', component: BreedSheetListComponent, canActivate: [AuthGuard] },
  { path: 'breedsheetviewer/:sheetId', component: BreedSheetViewerComponent, canActivate: [AuthGuard] },
  { path: 'colonies', component: ColoniesListComponent, canActivate: [AuthGuard]},
  { path: 'colonies/:colonyId', component: ColonyComponent,  canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'mail/activate', component: ActivationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, RoleGuard]
})
export class AppRoutingModule { }
