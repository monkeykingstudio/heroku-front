import { Injectable } from '@angular/core';
import { Diapause } from './../models/diapause.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DiapauseService {

  constructor(private http: HttpClient) { }

  diapauseAdd(diapause: Diapause) {
    console.log('from service', diapause);

    return this.http.post(`${environment.APIEndpoint}/api/diapause/add`, {diapause})
    .pipe(
      map(result => result['message']),
      shareReplay()
    );
  }
}
