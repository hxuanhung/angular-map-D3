import {
  Component,
  OnInit
} from '@angular/core';

import { AppState } from '../app.service';
import { GooglePlacesDirective } from '../google-places/google-places.directive';
import { Store } from '@ngrx/store';
import { store as reduxStore } from '../store';
import { addPlaceAction, removePlaceAction } from '../actions/maps.action';
@Component({
  selector: 'home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  public localState = { value: '' };
  public address: Object;
  public place: Object;
  public places$;
  public places;
  constructor(
    public appState: AppState,
    private store: Store<AppState>,
  ) {

  }

  public ngOnInit() {
    this.places$ = this.store.let(reduxStore.places.getPlaces).subscribe(places => {
      const roomPlaces = places[`ROOM_1`];
      this.places = roomPlaces != null ? Object.keys(roomPlaces).map(key => roomPlaces[key]) : [];

    });
  }
  public getAddress(place: Object) {
    console.log(`get Address here`, place);
    this.place = place;
    this.address = place['formatted_address'];
    let location = place['geometry']['location'];
    let lat = location.lat();
    let lng = location.lng();
  }

  public addPlace() {
    console.log(`addPlace`, this.place);
    this.address = ``;
    this.store.dispatch(new addPlaceAction(this.place));
  }
  public removePlace(name: string) {
    console.log(`removePlace`, name);
    this.store.dispatch(new removePlaceAction(name));
  }
}
