import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  storage;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    const isAuth = this.authService.getIsAuth;
    if (isAuth) {
      this.storage = JSON.parse(localStorage.getItem('currentUser'));

      if (!isAuth) {
        this.router.navigate(['/login']);
        return false;
      } else if (isAuth && this.storage.role === 'admin') {
        // this.router.navigate(['/breedingsheet']);
        return true;
      }
      else if (isAuth && this.storage.role !== 'admin') {
        this.router.navigate(['']);
        return false;
      }
      else {
        this.router.navigate(['']);
        return false;
      }
    }
    return false;
    this.router.navigate(['']);
  }

}
