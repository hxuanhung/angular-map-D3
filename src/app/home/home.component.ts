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
import * as L from 'leaflet';
import {DATA as myPoints} from './data';
declare let d3: any;
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
      center: L.latLng(22.30692675357551, 114.18306345846304),
      zoom: 4,
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
    let svg = d3.select(map.getPanes().overlayPane).append("svg"),
      g = svg.append("g").attr("class", "leaflet-zoom-hide");

    // d3.json("https://api.myjson.com/bins/113nlr", function (geoShape) {
    // d3.json("https://api.myjson.com/bins/7ieu7", function (error, myPoints) {
    //   if (error) throw error;
    var transform = d3.geo.transform({
      point: projectPoint
    }),
      path = d3.geo.path().projection(transform);
    var bounds = path.bounds(myPoints),
    topLeft = bounds[0],
    bottomRight = bounds[1];

  myPoints.features.forEach(function (d) {
    d[`LatLng`] = new L.LatLng(d.geometry.coordinates[1],
      d.geometry.coordinates[0]);
  });

  var circles = g.selectAll(".mark")
    .data(myPoints.features)
    .enter()
    .append("image")
    .attr('class', 'mark')
    .attr('width', 20)
    .attr('height', 20)
    .attr("xlink:href", 'https://cdn3.iconfinder.com/data/icons/softwaredemo/PNG/24x24/DrawingPin1_Blue.png');

  var texts = g.selectAll(".place-label")
    .data(myPoints.features)
    .enter()
    .append("text")
    .attr("class", "place-label")
    .attr("dy", "2.35em")
    .text(function (d) { return d.properties.name; });
  // var circles = g.selectAll("circle")
  //   .data(myPoints.features)
  //   .enter()
  //   .append("circle")
  //   .attr("r", 10)
  //   .style("fill", "red")
  //   .attr("fill-opacity", 0.5);

  // Use Leaflet to implement a D3 geometric transformation.
  function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  }

  function update() {
    circles.attr("x", function (d) {
      return map.latLngToLayerPoint(d.LatLng).x;
    });
    circles.attr("y", function (d) {
      return map.latLngToLayerPoint(d.LatLng).y;
    });
    texts.attr("x", function (d) {
      return map.latLngToLayerPoint(d.LatLng).x;
    });
    texts.attr("y", function (d) {
      return map.latLngToLayerPoint(d.LatLng).y;
    });
    svg.attr("width", bottomRight[0] - topLeft[0])
      .attr("height", bottomRight[1] - topLeft[1])
      .style("left", topLeft[0] + "px")
      .style("top", topLeft[1] + "px");

    g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
  }

  map.on("viewreset", update);
  update();




      // var LeafIcon = L.Icon.extend({
      //   options: {
      //     iconSize: [13, 22],
      //     iconAnchor: [6, 16],
      //     popupAnchor: [-3, -76]
      //   }
      // });
      // var fIcon = new LeafIcon({ iconUrl: 'puce_f.png' });
      // myPoints.features.forEach(function (d) {
      //   d.LatLng = new L.LatLng(d.geometry.coordinates[1],
      //     d.geometry.coordinates[0]);
      //   L.marker([d.geometry.coordinates[1], d.geometry.coordinates[0]], { icon: fIcon }).bindPopup(`${d.properties.name}`).addTo(map);
      // });

    // })
    this.places$ = this.store.let(reduxStore.places.getPlaces).subscribe(places => {
      const roomPlaces = places[`ROOM_1`];
      this.places = roomPlaces != null ? Object.keys(roomPlaces).map(key => roomPlaces[key]) : [];
      console.log(`object`, roomPlaces, places, this.places, Object.keys(roomPlaces));
      // console.log(this.convertDataToGeoJSONFormat(this.places));


    });
  }

  public convertDataToGeoJSONFormat(data) {
    let newData = {
      type: 'FeatureCollection',
      features: [],
    };
    data.forEach(place => {
      newData.features.push({
        type: 'Feature',
        properties: {
          ...place
        },
        geometry: {
          type: 'Point',
          coordinates: [place.geometry.location.lat(), place.geometry.location.lng()]
        }
      });
    });
    return newData;
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
