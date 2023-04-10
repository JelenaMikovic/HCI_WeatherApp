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
  showCurrent: boolean = true;

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