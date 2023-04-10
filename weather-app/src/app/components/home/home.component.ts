import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherService } from './weather.service';
import { AirQuality, Astro, Forecast, ForecastHistory, Forecastday, Hour } from './models/weather';

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

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.hasLoaded = false;
    this.getForecast();
    this.getForecastHistory();
  }

  getForecast() {
    this.weatherService.getForecast('Belgrade').subscribe((response) => {
      this.forecast = response;
      this.today = this.forecast.forecast.forecastday[0];
      this.setAlert();
      this.setDisplay();
      this.hasLoaded = true;
    });
  }

  getForecastHistory(){
    this.weatherService.getForecastHistory('Belgrade').subscribe((response) =>{
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

  }

  historyClicked(index: number) {
    console.log(this.forecastHistory.forecast.forecastday.at(index));
  }


  setDisplay(){
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