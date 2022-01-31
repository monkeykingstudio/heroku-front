import { Injectable } from '@angular/core';
import { Diapause } from './../models/diapause.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DiapauseService {

  constructor(private http: HttpClient) { }

  changeStatus(colonyId: string, status: string) {
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

  // GET all Diapauses
  getDiapauses(species: string) {
    return this.http.get(`${environment.APIEndpoint}/api/diapause/all/${species}`)
    .pipe(
      map(result => result['diapause']),
      shareReplay()
    );
  }

// POST Update
  diapauseUpdate(colonyId: string, currentTemperature: number) {

    return this.http.post(`${environment.APIEndpoint}/api/diapause/update/${colonyId}`, {currentTemperature})
    .pipe(
      map(result => result['message']),
      shareReplay()
    );
  }

// POST endedSaw
endedSaw(colonyId: string, endedSaw: boolean) {
  console.log('from servive diapause endedsaw', endedSaw);
  return this.http.post(`${environment.APIEndpoint}/api/diapause/endedSaw/${colonyId}`, {endedSaw})
  .pipe(
    map(result => result['message']),
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
