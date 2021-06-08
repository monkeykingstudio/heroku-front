import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ColoniesListComponent } from './colonies/colonies-list/colonies-list.component';
import { ColonyComponent } from './colonies/colony/colony.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ActivationComponent } from './auth/activation/activation.component';
import { BreedSheetCreatorComponent } from './breed-sheet-creator/breed-sheet-creator.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';


import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'adminpanel', component: AdminPanelComponent, canActivate: [RoleGuard] },
  { path: 'adminpanel/breedsheetcreator', component: BreedSheetCreatorComponent, canActivate: [RoleGuard] },
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
