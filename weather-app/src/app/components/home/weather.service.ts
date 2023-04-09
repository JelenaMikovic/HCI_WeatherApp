import {HttpClient,HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable({
  providedIn:"root"
})

export class WeatherService{
  constructor(private http:HttpClient) { }
  apiHost = 'http://api.weatherapi.com/v1/';
  key = 'c0e9367d1f0b4237804175441230804';

  getForecast(city: string): Observable<Forecast> {
    const url = `${this.apiHost}/forecast.json?key=${this.key}&q=${city}&days=3&aqi=yes&alerts=yes`;
    return this.http.get<Forecast>(url);
  }

}
