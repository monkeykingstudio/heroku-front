import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BreedingSheet } from '../models/breedingSheet.model';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class BreedingSheetsService {
  private breedingSheetsUrl = `${environment.APIEndpoint}/api/breedingsheets`;

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

  updateFood(id: string, foods: any, species: string, dataNotification: Notification) {
    return this.http.post<BreedingSheet>(`${this.breedingSheetsUrl}/upfood/${id}`, {foods, species, dataNotification});
  }

  updateGeography(id: string, geography: any, species: string, dataNotification: Notification) {
    return this.http.post<BreedingSheet>(`${this.breedingSheetsUrl}/upgeo/${id}`, {geography, species, dataNotification});
  }

  updateDiapause(
    id: string, needs: any, temperatures: any, months: any, species: string, dataNotification: Notification
    ): Observable<BreedingSheet> {
    return this.http.post<BreedingSheet>(
      `${this.breedingSheetsUrl}/updiapause/${id}`, {needs, temperatures, months, species, dataNotification}
      );
  }

  updateBehavior(
    id: string, polyGyne: any, claustral: any, driller: any, drinker: any, species: string, dataNotification: Notification
    ): Observable<BreedingSheet> {
    return this.http.post<BreedingSheet>(`${this.breedingSheetsUrl}/upbehaviors/${id}`,
    {polyGyne, claustral, driller, drinker, species, dataNotification});
  }

  updateMorphism(
    id: string,
    polyMorphism: any,
    gyneSize: any,
    maleSize: any,
    workerSize: any,
    majorSize: any,
    gyneLives: any,
    workerLives: any,
    species: string,
    dataNotification: Notification
    ): Observable<BreedingSheet> {
    return this.http.post<BreedingSheet>(`${this.breedingSheetsUrl}/upmorphism/${id}`,
      {polyMorphism, gyneSize, maleSize, majorSize, workerSize, workerLives, gyneLives, species, dataNotification}
    );
  }

  updateCharacteristics(id: string, characteristics: any, species: string, dataNotification: Notification): Observable<BreedingSheet> {
    return this.http.post<BreedingSheet>(`${this.breedingSheetsUrl}/upchara/${id}`, {characteristics, species, dataNotification});
  }

  updateGynePictures(id: string, gynePictures: any, species: string, dataNotification: Notification) {
    return this.http.post<BreedingSheet>(`${this.breedingSheetsUrl}/gynepictures/${id}`, {gynePictures, species, dataNotification});
  }

  updatePictures(id: string, pictures: any, species: string, dataNotification: Notification) {
    return this.http.post<BreedingSheet>(`${this.breedingSheetsUrl}/pictures/${id}`, {pictures, species, dataNotification});
  }

  updatePrimary(
    id: string,
    species: string,
    temperature: any,
    hygrometry: any,
    family: string,
    subfamily: string,
    genre: string,
    tribu: string,
    difficulty: number,
    dataNotification: Notification,
    ): Observable<BreedingSheet> {
      return this.http.post<BreedingSheet>(`${this.breedingSheetsUrl}/primary/${id}`,
      {species, temperature, hygrometry, family, subfamily, genre, tribu, difficulty, dataNotification});
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

  deleteSheetNotif(
    id: string,
    reciever: string,
    species: string,
    userNotification: Notification,
    adminNotification: Notification
    ) {
    return this.http.post<Notification>(`${this.breedingSheetsUrl}/${id}`, {reciever, species, userNotification, adminNotification});
  }

  approveSheet(id: string) {
    console.log('from service approve sheet', id);
    return this.http.post<BreedingSheet>(`${this.breedingSheetsUrl}/approve/${id}`, {})
    .pipe(
      shareReplay()
    );
  }

  approveSheetNotif(
    id: string,
    reciever: string,
    species: string,
    userNotification: Notification,
    adminNotification: Notification
    ) {
    console.log('from service approve sheet notifications', reciever, species, userNotification, adminNotification);
    // tslint:disable-next-line:max-line-length
    return this.http.post<Notification>(`${this.breedingSheetsUrl}/approvenotif/${id}`, {reciever, species, userNotification, adminNotification});
  }
}
