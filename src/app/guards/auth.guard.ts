import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  storage;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    const isAuth = this.authService.getIsAuth;
    if (isAuth) {
      this.storage = JSON.parse(localStorage.getItem('currentUser'));

      if (!isAuth && !this.storage.is_verified) {
        this.router.navigate(['/login']);
        return false;
      } else if (isAuth && this.storage.is_verified) {
        return true;
      } else {
        this.router.navigate(['/login']);

        return false;
      }
    }
    return false;
    this.router.navigate(['/login']);
  }

}
