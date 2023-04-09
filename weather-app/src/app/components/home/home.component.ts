import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherService } from './weather.service';
import { Forecast } from './models/weather';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  forecast: Forecast = {} as Forecast;
  hasLoaded: boolean = false;

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.hasLoaded = false;
    this.getForecast();
    this.hasLoaded = true;
  }

  getForecast() {
    this.weatherService.getForecast('Belgrade').subscribe((response) => {
      this.forecast = response;
      console.log(response);
      console.log(this.forecast);
    });
  }
}