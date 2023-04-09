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
  hasLoaded: boolean = false;
  chosenDay: Forecastday = {} as Forecastday;

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.hasLoaded = false;
    this.getForecast();
    this.hasLoaded = true;
    this.setHourly();
  }

  getForecast() {
    this.weatherService.getForecast('Belgrade').subscribe((response) => {
      this.forecast = response;
      this.chosenDay = this.forecast.forecast.forecastday[0];
    });
  }

  setHourly(){
    
  }
}