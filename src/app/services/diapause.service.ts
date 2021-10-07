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

  // ADD Diapause
  diapauseAdd(diapause: Diapause) {
    return this.http.post(`${environment.APIEndpoint}/api/diapause/add`, diapause)
    .pipe(
      map(result => result['message']),
      shareReplay()
    );
  }

  // GET Diapause
  diapauseGet(colonyId: string) {
    console.log('from service', colonyId);
    return this.http.get(`${environment.APIEndpoint}/api/diapause/${colonyId}`)
    .pipe(
      map(result => result['diapause']),
      shareReplay()
    );
  }
}
