import {HttpClient,HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Forecast, SearchLocation} from "./models/weather";
import { DatePipe } from '@angular/common';


@Injectable({
  providedIn:"root"
})

export class WeatherService{
  constructor(private http:HttpClient) { }
  apiHost = 'http://api.weatherapi.com/v1';
  key = 'c0e9367d1f0b4237804175441230804';
  currentDate = new Date()
  fromDate = new Date(this.currentDate.getTime() - (7 * 24 * 60 * 60 * 1000));

  toDate = new Date();

  getForecast(city: string): Observable<Forecast> {
    const url = `${this.apiHost}/forecast.json?key=${this.key}&q=${city}&days=5&aqi=yes&alerts=yes`;
    return this.http.get<Forecast>(url);
  }

  getForecastHistory(city: string): Observable<Forecast>{
    const formattedFrom = this.fromDate.toISOString().slice(0, 10);
    const formattedTo = this.toDate.toISOString().slice(0, 10);
    console.log("KARAAA")
    console.log(formattedFrom);
    console.log(formattedTo);
    const url = `${this.apiHost}/history.json?key=${this.key}&q=${city}&dt=${formattedFrom}&end_dt=${formattedTo}`;
    return this.http.get<Forecast>(url);
  }

  getLocation(lat:number,lon:number):Observable<SearchLocation[]>{
    const locationApiUrl = `https://api.weatherapi.com/v1/search.json?key=${this.key}&q=${lat},${lon}`;
    return this.http.get<SearchLocation[]>(locationApiUrl);
  }

}
