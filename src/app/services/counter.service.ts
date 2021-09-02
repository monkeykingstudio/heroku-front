import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Counter } from '../models/counter.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CounterService {

  private counterUrl = `${environment.APIEndpoint}/api/colonies/counter`;
  constructor(private http: HttpClient) {}

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
