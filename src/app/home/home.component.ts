import {
  Component,
  OnInit
} from '@angular/core';

import { AppState } from '../app.service';
import { GooglePlacesDirective } from '../google-places/google-places.directive';
import { Store } from '@ngrx/store';
import { store as reduxStore } from '../store';
import { addPlaceAction, removePlaceAction } from '../actions/maps.action';
import { MapService } from '../services/map.service';
// import * as L from 'leaflet';
declare let d3: any;
declare let L: any;
interface MapsStore {
  data: {}
}


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
  public places;
  /**
   * TypeScript public modifiers
   */
  constructor(
    public appState: AppState,
    private store: Store<AppState>,
    private mapService: MapService
  ) {

  }

  public ngOnInit() {
    let map = L.map("map", {
      zoomControl: false,
      center: L.latLng(46.81509864599243, 8.3221435546875),
      zoom: 8,
      minZoom: 4,
      maxZoom: 19,
      layers: [this.mapService.baseMaps.OpenStreetMap]
    });

    L.control.zoom({ position: "topright" }).addTo(map);
    L.control.layers(this.mapService.baseMaps).addTo(map);
    L.control.scale().addTo(map);
    // http://bl.ocks.org/d3noob/9211665
    //http://plnkr.co/edit/Lqme891ee8rwDiXktY5L?p=preview
    //https://bost.ocks.org/mike/leaflet/
    //https://tools.ietf.org/html/rfc7946#section-3.1.3
    // http://bl.ocks.org/matt-mcdaniel/47033dfacfd7553489ea D3 + Leaflet with Auto Fit to Bounds
    var cities = [];
    var data = {
      test: [{
        name: "Meyrin",
        geometry: {
          location: {
            lat: 46.2328413,
            lng: 6.0817791
          },
        }
      }]
    };
    var citiesOverlay = L.d3SvgOverlay(function (sel, proj) {
      sel.selectAll('.mark').data(cities)
        .enter()
        .append('image')
        .attr('class', 'mark')
        .attr('x', function (d) {
          return proj.latLngToLayerPoint([d.geometry.location.lat(), d.geometry.location.lng()]).x;
        })
        .attr('y', function (d) {
          return proj.latLngToLayerPoint([d.geometry.location.lat(), d.geometry.location.lng()]).y;
        })
        .attr('width', 20)
        .attr('height', 20)
        .attr("xlink:href", 'https://cdn3.iconfinder.com/data/icons/softwaredemo/PNG/24x24/DrawingPin1_Blue.png');

      sel.selectAll(".place-label")
        .data(cities)
        .enter()
        .append("text")
        .attr('x', function (d) {
          return proj.latLngToLayerPoint([d.geometry.location.lat(), d.geometry.location.lng()]).x;
        })
        .attr('y', function (d) {
          return proj.latLngToLayerPoint([d.geometry.location.lat(), d.geometry.location.lng()]).y;
        })
        .attr("class", "place-label")
        .attr("dy", "2.35em")
        .text(function (d) {
          return d.name;
        });
    });

    this.places$ = this.store.let(reduxStore.places.getPlaces).subscribe(places => {
      const roomPlaces = places[`ROOM_1`];
      this.places = roomPlaces != null ? Object.keys(roomPlaces).map(key => roomPlaces[key]) : [];

      cities = this.places;
      citiesOverlay.addTo(map);
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
