import {Component, HostListener} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {HttpClient} from "@angular/common/http";

declare var google: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  constructor(private http: HttpClient) { }

  cities: any[] = [];
  showDropdown = false;
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

  onCitySelect(city: any): void {
    console.log(city); // do something with the selected city
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any): void {
    if (!event.target.closest('.dropdown') && this.showDropdown) {
      this.showDropdown = false;
    }
  }
}
