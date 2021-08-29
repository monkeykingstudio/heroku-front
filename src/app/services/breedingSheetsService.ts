import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BreedingSheet } from '../models/breedingSheet.model';
import { map, shareReplay, catchError } from 'rxjs/operators';
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

  getFiltered(filterData: any[]): Observable<BreedingSheet[]> {
    console.log(filterData);
    return this.http.get<BreedingSheet[]>(`${this.breedingSheetsUrl}/filter/search?family=${filterData[0]}&subfamily=${filterData[1]}&genre=${filterData[2]}&tribu=${filterData[3]}&difficulty=${filterData[4]}&region=${filterData[5]}&polygyne=${filterData[6]}&diapause=${filterData[7]}`)
    .pipe(
      map(filteredResult => filteredResult['breedingSheets']),
      shareReplay()
    );
  }

  getSheet(species: string) {
    return this.http.get<BreedingSheet>(`${this.breedingSheetsUrl}/${species}`)
    .pipe(
      map(result => result['sheet'])
    );
  }

  updateFood(id: string, foods: any) {
    return this.http.post<BreedingSheet>(`${this.breedingSheetsUrl}/upfood/${id}`, {foods});
  }

  updateGeography(id: string, geography: any) {
    return this.http.post<BreedingSheet>(`${this.breedingSheetsUrl}/upgeo/${id}`, {geography});
  }

  updateDiapause(id: string, needs: any, temperatures: any, months: any): Observable<BreedingSheet> {
    return this.http.post<BreedingSheet>(`${this.breedingSheetsUrl}/updiapause/${id}`, {needs, temperatures, months});
  }

  updateBehavior(id: string, polyGyne: any, claustral: any, driller: any, drinker: any): Observable<BreedingSheet> {
    return this.http.post<BreedingSheet>(`${this.breedingSheetsUrl}/upbehaviors/${id}`, {polyGyne, claustral, driller, drinker});
  }

  updateMorphism(
    id: string,
    polyMorphism: any,
    gyneSize: any,
    maleSize: any,
    workerSize: any,
    majorSize: any,
    gyneLives: any,
    workerLives: any
    ): Observable<BreedingSheet> {
    return this.http.post<BreedingSheet>(`${this.breedingSheetsUrl}/upmorphism/${id}`,
      {polyMorphism, gyneSize, maleSize, majorSize, workerSize, workerLives, gyneLives}
    );
  }

  updateCharacteristics(id: string, characteristics: any): Observable<BreedingSheet> {
    return this.http.post<BreedingSheet>(`${this.breedingSheetsUrl}/upchara/${id}`, {characteristics});
  }

  updateGynePictures(id: string, gynePictures: any) {
    return this.http.post<BreedingSheet>(`${this.breedingSheetsUrl}/gynepictures/${id}`, {gynePictures});
  }

  updatePictures(id: string, pictures: any) {
    return this.http.post<BreedingSheet>(`${this.breedingSheetsUrl}/pictures/${id}`, {pictures});
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
