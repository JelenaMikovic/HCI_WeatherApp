import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {WeatherService} from "./weather.service";
import {Forecast} from "./models/weather";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  //forecast: Forecast;
  constructor(private weatherService:WeatherService) {}

  ngOnInit(): void {
    
  }

  getForecast(){

  }
}
