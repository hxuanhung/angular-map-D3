import {
  Component,
  OnInit
} from '@angular/core';

import { AppState } from '../app.service';
import { GooglePlacesDirective } from '../google-places/google-places.directive';
import { Store } from '@ngrx/store';
import { store as reduxStore } from '../store';
import { addPlaceAction } from '../actions/maps.action';
@Component({
  selector: 'home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  /**
   * Set our default values
   */

  public localState = { value: '' };
  public address: Object;
  public place: Object;
  public places$;
  /**
   * TypeScript public modifiers
   */
  constructor(
    public appState: AppState,
    private store: Store<AppState>,
  ) {
    this.places$ = this.store.let(reduxStore.places.getPlaces)
      .subscribe(data => {
        console.log(`data`, data);
      })
  }

  public ngOnInit() {
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
    this.store.dispatch(new addPlaceAction(this.place));
  }
}
