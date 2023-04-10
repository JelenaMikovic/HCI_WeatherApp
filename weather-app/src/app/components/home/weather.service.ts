import {HttpClient,HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import { Forecast } from "./models/weather";
import { DatePipe } from '@angular/common';


@Injectable({
  providedIn:"root"
})

export class WeatherService{
  constructor(private http:HttpClient) { }
  apiHost = 'http://api.weatherapi.com/v1';
  key = 'c0e9367d1f0b4237804175441230804';
  currentDate = new Date()
  toDate = new Date().setDate(this.currentDate.getDate() + 2);
  fromDate = new Date().setDate(this.currentDate.getDate() + 2);

  getForecast(city: string): Observable<Forecast> {
    const url = `${this.apiHost}/forecast.json?key=${this.key}&q=${city}&days=3&aqi=yes&alerts=yes`;
    return this.http.get<Forecast>("http://api.weatherapi.com/v1/forecast.json?key=c0e9367d1f0b4237804175441230804&q=Miami&days=3&aqi=yes&alerts=yes");
  }

  getForecastHistory(city: string): Observable<Forecast>{
    const url = `${this.apiHost}/history.json?key=${this.key}&q=${city}&dt=${this.fromDate}&end_dt=${this.toDate}`;
    return this.http.get<Forecast>("http://api.weatherapi.com/v1/forecast.json?key=c0e9367d1f0b4237804175441230804&q=Belgrade&dt=2023-04-02&end_dt=2023-04-12");
  }

}
