import { Injectable } from '@angular/core';
import { Diapause } from './../models/diapause.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';
import { Subscription, interval, Subject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DiapauseService {

  constructor(private http: HttpClient) { }

  changeStatus(colonyId: string, status: string) {
    console.log('from service diapause change status', status);

    return this.http.post(`${environment.APIEndpoint}/api/diapause/status/${colonyId}`, {status})
    .pipe(
      map(result => result['message']),
      shareReplay()
    );
  }

  loadDiapause(colonyId: string): Observable<Diapause[]> {
    return this.http.get<Diapause[]>(`${environment.APIEndpoint}/api/diapause/${colonyId}`)
    .pipe(
      map(result => result['diapause'])
    );
  }

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
    return this.http.get(`${environment.APIEndpoint}/api/diapause/${colonyId}`)
    .pipe(
      map(result => result['diapause']),
      shareReplay()
    );
  }

  // DELETE Diapause
  diapauseDelete(colonyId: string) {
    console.log('from servive diapause delete', colonyId);
    return this.http.delete(`${environment.APIEndpoint}/api/diapause/delete/${colonyId}`)
    .pipe(
      map(result => result['diapause']),
      shareReplay()
    );
  }

    // ARCHIVE Diapause
  diapauseArchive(colonyId: string, status: string) {
    console.log('from servive diapause archive', 'get status: ', status);

    return this.http.post(`${environment.APIEndpoint}/api/diapause/archive/${colonyId}`, {status})
    .pipe(
      map(result => result['message']),
      shareReplay()
    );
  }
}
