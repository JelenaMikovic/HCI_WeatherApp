import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

declare var google: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  autocompleteService = new google.maps.places.AutocompleteService();
  searchInput: string = '';
  predictions: { description: string, place_id: string }[] = [];

  autocomplete() {
    if (this.searchInput.length > 0) {
      this.autocompleteService.getPlacePredictions({ input: this.searchInput },
        (predictions: any[], status: string) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            this.predictions = predictions.map(prediction => {
              return { description: prediction.description, place_id: prediction.place_id };
            });
          } else {
            this.predictions = [];
          }
        });
    } else {
      this.predictions = [];
    }
  }

  selectCity(prediction: { description: string, place_id: string }) {
    this.searchInput = prediction.description;
    this.predictions = [];
    // do something with the selected city, e.g. navigate to a new page
  }
}
