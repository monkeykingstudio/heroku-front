import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BreedingSheet } from '../models/breedingSheet.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BreedingSheetsService {
  private breedingSheetsUrl = 'https://calm-waters-91692.herokuapp.com/api/breedingsheets';

  constructor(private http: HttpClient) {}

  getSheet(species: string) {
    return this.http.get<BreedingSheet>(`${this.breedingSheetsUrl}/${species}`).pipe(
      map(result => result['sheet']),
    );
  }
}
