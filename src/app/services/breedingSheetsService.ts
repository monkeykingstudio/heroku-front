import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BreedingSheet } from '../models/breedingSheet.model';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreedingSheetsService {
  private breedingSheetsUrl = 'https://calm-waters-91692.herokuapp.com/api/breedingsheets';

  constructor(private http: HttpClient) {}

  getAll(): Observable<BreedingSheet[]> {
    return this.http.get<any>(this.breedingSheetsUrl)
    .pipe(
      map(result => result['breedingSheets']),
      shareReplay());
  }

  getSheet(species: string) {
    return this.http.get<BreedingSheet>(`${this.breedingSheetsUrl}/${species}`).pipe(
      map(result => result['sheet']),
    );
  }

  getSheetById(id: string) {
    return this.http.get<BreedingSheet>(`${this.breedingSheetsUrl}/${id}`).pipe(
      map(result => result['sheet']),
    );
  }

  createSheet(sheet) {
    return this.http.post<BreedingSheet>(this.breedingSheetsUrl, sheet)
    .pipe(
      shareReplay()
    );
  }

  deleteSheet(id: string) {
    return this.http.delete<BreedingSheet>(`${this.breedingSheetsUrl}/${id}`)
    .pipe(
      shareReplay()
    );
  }
}
