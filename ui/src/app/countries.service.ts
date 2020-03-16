import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import {Observable} from 'rxjs/Observable';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class CountriesService {

  constructor(private http:HttpClient) { }

      // Uses http.get() to load data from a single API endpoint
  getCountryData(country) {
    return this.http.get('/api/countries/'+ country);
  }
  getCountryList() {
    return this.http.get('/api/countries/');
  }
}
