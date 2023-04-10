import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherService } from './weather.service';
import { Forecast, Forecastday } from './models/weather';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  forecast: Forecast = {} as Forecast;
  forecastHistory: Forecast = {} as Forecast;
  hasLoaded: boolean = false;
  hasLoadedHistory: boolean = false;
  chosenDay: Forecastday = {} as Forecastday;
  alert: string = "";

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.hasLoaded = false;
    this.getForecast();
    this.getForecastHistory();
  }

  getForecast() {
    this.weatherService.getForecast('Belgrade').subscribe((response) => {
      this.forecast = response;
      this.chosenDay = this.forecast.forecast.forecastday[0];
      this.setAlert();
      this.hasLoaded = true;
    });
  }

  getForecastHistory(){
    this.weatherService.getForecastHistory('Belgrade').subscribe((response) =>{
      this.forecastHistory = response;
      this.hasLoadedHistory = true;
      console.log("ISTORIJAA")
      console.log(this.forecastHistory);
    })
  }

  setAlert() {
    console.log(this.forecast.alerts.alert)
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
}
