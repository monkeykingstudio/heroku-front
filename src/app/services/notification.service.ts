import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private breedingSheetsUrl = `${environment.APIEndpoint}/api/breedingsheets`;


  constructor() { }
}
