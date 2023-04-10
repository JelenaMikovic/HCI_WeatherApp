import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherService } from './weather.service';
import { AirQuality, Astro, Forecast, ForecastHistory, Forecastday, Hour } from './models/weather';
import {map} from "rxjs/operators";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  forecast: Forecast = {} as Forecast;
  forecastHistory: ForecastHistory = {} as ForecastHistory;
  hasLoaded: boolean = false;
  hasLoadedHistory: boolean = false;
  today: Forecastday = {} as Forecastday;
  alert: string = "";
  display: Display = {} as Display;
  latitude: number = 0;
  longitude: number = 0;
  showCurrent: boolean = true;
  cities: any[] = [];
  showDropdown = false;
  myInput = document.getElementById('searchField') as HTMLInputElement;
  constructor(private weatherService: WeatherService, private http: HttpClient) {}

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.hasLoaded = false;
        this.weatherService.getLocation(this.latitude,this.longitude).subscribe((response) => {
          console.log(response)
          this.getForecast(response[0].name);
          this.getForecastHistory(response[0].name);
        });
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
      this.hasLoaded = false;
      this.getForecast('Novi Sad');
      this.getForecastHistory('Novi Sad');
    }

  }

  onCitySelect(index: number): void {
    console.log(index); // do something with the selected city
    //this.liClick.emit();
    this.getForecast(this.cities[index].name);
    this.getForecastHistory(this.cities[index].name);
    document.getElementById("searchField");
    this.showDropdown = false;
    this.myInput.value = "";
    this.myInput.placeholder = 'Search for a city';
  }

  onSearch(event: any): void {
    const query = event.target.value;
    if (query.length > 2) {
      const apiUrl = `http://api.weatherapi.com/v1/search.json?key=c0e9367d1f0b4237804175441230804&q=${query}`;
      this.http.get(apiUrl).pipe(
        map((res: any) => res.map((city: any) => ({ name: city.name, region: city.region, country: city.country })) )
      ).subscribe((cities: any[]) => {
        this.cities = cities;
        this.showDropdown = true;
      });
    } else {
      this.cities = [];
      this.showDropdown = false;
    }
    if (!query) {
      this.showDropdown = false;
    }
  }

  getForecast(city:string) {
    this.weatherService.getForecast(city).subscribe((response) => {
      this.forecast = response;
      this.today = this.forecast.forecast.forecastday[0];
      this.setAlert();
      this.setDisplay();
      this.hasLoaded = true;
    });
  }

  getForecastHistory(city:string){
    this.weatherService.getForecastHistory(city).subscribe((response) =>{
      this.forecastHistory = response;
      this.hasLoadedHistory = true;
      console.log("ISTORIJAA")
      console.log(response);
      console.log(this.forecastHistory);
    })
  }

  setAlert() {
    if (this.forecast.alerts.alert.length > 0) {
      for (let i=0; i<this.forecast.alerts.alert.length; i++){
        const effective = new Date(this.forecast.alerts.alert[i].effective);
        const expires = new Date(this.forecast.alerts.alert[i].expires);
        const today = new Date();
        if (today <= expires && today >= effective) {
          this.alert = this.forecast.alerts.alert[i].headline;
          return
        }
      }
    }
    this.alert = "no alerts"
  }

  onHourClick(index: number){
    console.log('Clicked on hour:', index);
    const hour = this.display.hourlyForecast.at(index);
    if (hour) {
      this.display.airQuality = hour.air_quality;
      this.display.feelsLike = hour.feelslike_c;
      this.display.humidity = hour.humidity;
      this.display.visibility = hour.vis_km;
      this.display.precipation = hour.precip_in;
      this.display.uv = hour.uv;
      this.display.wind = {direction: hour.wind_dir, speed: hour.wind_kph};
    }
  }

  onDayClick(index: number){
    console.log('Clicked on hour:', this.forecast.forecast.forecastday.at(index));
    this.showCurrent = false;
    this.display.humidity = this.forecast.forecast.forecastday[index].day.avghumidity;
    this.display.hourlyForecast = this.forecast.forecast.forecastday[index].hour;
    this.display.astroForecast = this.forecast.forecast.forecastday[index].astro;
    this.display.airQuality = this.forecast.forecast.forecastday[index].day.air_quality;
    this.display.visibility = this.forecast.forecast.forecastday[index].day.avgvis_km;
    this.display.precipation = this.forecast.forecast.forecastday[index].day.totalprecip_in;
    this.display.feelsLike = this.forecast.forecast.forecastday[index].day.avgtemp_c;
    this.display.uv = this.forecast.forecast.forecastday[index].day.uv;
    this.display.wind = {direction: this.forecast.current.wind_dir,
    speed: this.forecast.forecast.forecastday[index].day.maxwind_kph}
  }

  historyClicked(index: number) {
    console.log(this.forecastHistory.forecast.forecastday.at(index));
    this.showCurrent = false;
    this.display.humidity = this.forecastHistory.forecast.forecastday[index].day.avghumidity;
    this.display.hourlyForecast = this.forecastHistory.forecast.forecastday[index].hour;
    this.display.astroForecast = this.forecastHistory.forecast.forecastday[index].astro;
    //this.display.airQuality = this.forecastHistory.forecast.forecastday[index].day.air_quality;
    this.display.visibility = this.forecastHistory.forecast.forecastday[index].day.avgvis_km;
    this.display.precipation = this.forecastHistory.forecast.forecastday[index].day.totalprecip_in;
    this.display.feelsLike = this.forecastHistory.forecast.forecastday[index].day.avgtemp_c;
    this.display.uv = this.forecastHistory.forecast.forecastday[index].day.uv;
    this.display.wind = {direction: this.forecast.current.wind_dir,
    speed: this.forecastHistory.forecast.forecastday[index].day.maxwind_kph}
  }


  setDisplay(){
    this.showCurrent = true;
    this.display.hourlyForecast = this.today.hour;
    this.display.astroForecast = this.today.astro;
    this.display.airQuality = this.forecast.current.air_quality;
    this.display.feelsLike = this.forecast.current.feelslike_c;
    this.display.humidity = this.forecast.current.humidity;
    this.display.visibility = this.forecast.current.vis_km;
    this.display.precipation = this.forecast.current.precip_in;
    this.display.pressure = this.forecast.current.pressure_in;
    this.display.uv = this.forecast.current.uv;
    this.display.wind = {direction: this.forecast.current.wind_dir,
    speed: this.forecast.current.wind_kph}
  }

  getDayOfWeek(dateString: string) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    const dayOfWeekIndex = date.getDay();
    return daysOfWeek[dayOfWeekIndex];
  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  calculateAqi(pm25: number): number {
    const breakpoints = [0, 12.1, 35.5, 55.5, 150.5, 250.5, 350.5, 500.5];
    const aqiRange = [0, 50, 100, 150, 200, 300, 400, 500];

    let i: number;
    for (i = 0; i < breakpoints.length; i++) {
      if (pm25 <= breakpoints[i]) {
        break;
      }
    }

    if (i === 1) {
      return Math.round(((aqiRange[i] - aqiRange[i - 1]) / (breakpoints[i] - breakpoints[i - 1])) * (pm25 - breakpoints[i - 1]) + aqiRange[i - 1]);
    } else {
      return Math.round(((aqiRange[i] - aqiRange[i - 1]) / (breakpoints[i] - breakpoints[i - 1])) * (pm25 - breakpoints[i - 1]) + aqiRange[i - 1]);
    }
  }

  co2ToWidth(co2: number): string {
    const maxCo2 = 5000;
    const minCo2 = 0;
    const maxWidth = 100;

    const width = (co2 - minCo2) * maxWidth / (maxCo2 - minCo2);

    return `${width}%`;
  }

  getNo2ProgressBarWidth(): string {
    const no2 = this.display.airQuality.no2;
    let width: number;

    if (no2 <= 53) {
      width = no2 / 53 * 25;
    } else if (no2 <= 100) {
      width = (no2 - 53) / 47 * 25 + 25;
    } else if (no2 <= 360) {
      width = (no2 - 100) / 260 * 25 + 50;
    } else if (no2 <= 649) {
      width = (no2 - 360) / 289 * 25 + 75;
    } else if (no2 <= 1249) {
      width = (no2 - 649) / 600 * 25 + 90;
    } else {
      width = 100;
    }

    return `${width}%`;
  }

  getSO2Width(so2: number): string {
    const value = Math.min(Math.floor(so2 / 20), 5) * 20;
    return `${value}%`;
  }

  getPM2_5Width(pm2_5: number): string {
    if (pm2_5 > 500) {
      return '100%';
    } else if (pm2_5 < 0) {
      return '0%';
    } else {
      return Math.round(pm2_5 / 500 * 100) + '%';
    }
  }

  getO3Width(o3Value: number): string {
    if (o3Value > 300) {
      return '100%';
    } else if (o3Value < 0) {
      return '0%';
    } else {
      return Math.round(o3Value / 300 * 100) + '%';
    }
  }

  getPm10Width(pm10Value: number): string {
    if (pm10Value > 500) {
      return '100%';
    } else if (pm10Value < 0) {
      return '0%';
    } else {
      return Math.round(pm10Value / 500 * 100) + '%';
    }
  }
}



interface Display{
  hourlyForecast: Hour[];
  astroForecast: Astro;
  airQuality: AirQuality;
  feelsLike: number;
  humidity: number;
  visibility: number;
  precipation: number;
  uv: number;
  pressure: number;
  wind: {
    direction: string;
    speed: number;
  }
}
