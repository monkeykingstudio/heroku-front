import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Counter } from '../models/counter.model';

@Injectable({
  providedIn: 'root'
})
export class CounterService {

  private counterUrl = 'https://calm-waters-91692.herokuapp.com/api/colonies/counter';
  constructor(private http: HttpClient) {}

  // loadCounter(): Observable<Counter> {
  //   return this.http.get<Counter>('http://localhost:3000/api/colonies/counter')
  //   .pipe(
  //     map(res => res['counter']),
  //     shareReplay()
  //   );
  // }

  updateCounter(
    minorCount: number,
    mediumCount: number,
    majorCount: number,
    colonyId: string,
    polymorph: boolean,
    polyCount?: number,
    breed?: boolean,
    breedCount?: number,
    ) {

    const counter: Counter = {minorCount, mediumCount, majorCount, polymorph, colonyId, polyCount, breed, breedCount};
    return this.http.put(`${this.counterUrl}/${colonyId}`, counter)
    .subscribe(response => console.log( response, counter));
  }
}
