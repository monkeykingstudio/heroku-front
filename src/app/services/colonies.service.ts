import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Colony } from './../colonies/colony.model';
import { map, shareReplay, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColoniesService {
  private colonyUrl = `${environment.APIEndpoint}/api/colonies`;

  constructor(private http: HttpClient) {}

  loadAllColonies(): Observable<Colony[]> {
    return this.http.get<Colony[]>(this.colonyUrl)
    .pipe(
      map(result => result['colonies']),
      shareReplay()
    );
  }

  loadAllUsersColonies(): Observable<Colony[]> {
    return this.http.get<Colony[]>(`${this.colonyUrl}/allcolonies`)
    .pipe(
      map(colonies => colonies['colonies']),
      shareReplay());
  }

  loadUserColonies(id: string): Observable<Colony[]> {
    return this.http.get<Colony[]>(`${this.colonyUrl}/allcolonies/${id}`)
    .pipe(
      map(colonies => colonies['colonies']),
      shareReplay());
  }

  loadColony(id: string): Observable<Colony> {
    return this.http.get<Colony>(`${this.colonyUrl}/${id}`)
    .pipe(
      shareReplay()
    );
  }

  createColony(colony) {
    return this.http.post<Colony>(this.colonyUrl, colony)
    .pipe(
      shareReplay()
    );
  }

  deleteColony(colonyId: string) {
    return this.http.delete(`${this.colonyUrl}/${colonyId}`);
  }
}
