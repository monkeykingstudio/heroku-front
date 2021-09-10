import { EMPTY, NEVER, Observable } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to api url
    const currentUser = this.authService.getIsAuth;
    const isLoggedIn = currentUser && currentUser.token;
    const isApiUrl = request.url.startsWith(environment.APIEndpoint);
    const requestPath : string =  request.url.split(environment.APIEndpoint)[1]
    //path should not be cancelled
    const excludedPath : Array<string> = ['/api/auth/login', '/api/auth/logout']


    var excludedPathIsPresent : boolean = false
     excludedPath.map((p : string) => {
      if (requestPath === p) {
        excludedPathIsPresent = true
      }
    })

    if (!currentUser && !excludedPathIsPresent) return EMPTY //cancel the current request
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
    }

    return next.handle(request);
  }
}
