import { Component, OnInit, Output, EventEmitter, Input, OnChanges, OnDestroy, SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { MapService } from '../services/map.service';

import { Observable } from 'rxjs/Rx';
declare let d3: any;
declare let L: any;
/**
 * TIMES*1000 = number of seconds to wait between two consecutive inputs
 */
const TIMES = 5;
@Component({
  selector: 'map',
  template: '<div id="map"> </div>',
  styles: [`
  #map {
    width: 100%;
    height: 500px;
  }
  .mark {
    margin-left: -15px,
    margin-top: -35px
  }
  `],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MapComponent implements OnInit, OnChanges, OnDestroy {
  @Input() places = [];
  placesSbj = new Subject();

  constructor(private mapService: MapService,
    private cd: ChangeDetectorRef,

  ) { }

  // tslint:disable-next-line:no-unused-variable
  ngOnChanges(changes: SimpleChanges) {
    this.placesSbj.next(this.places);
  }

  ngOnInit() {
    let map = L.map("map", {
      center: L.latLng(46.81509864599243, 8.3221435546875),
      zoom: 8,
      // minZoom: 4,
      // maxZoom: 19,
      layers: [this.mapService.baseMaps.OpenStreetMap]
    });

    L.control.zoom({ position: "topright" }).addTo(map);
    L.control.layers(this.mapService.baseMaps).addTo(map);
    L.control.scale().addTo(map);

    let cities = [];
    let citiesOverlay = L.d3SvgOverlay(function (sel, proj) {
      console.log(`trigger zooming`, proj.scale);
      sel.selectAll('.mark').remove();
      sel.selectAll('.place-label').remove();
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
        .attr('width', 30 / proj.scale)
        .attr('height', 70 / proj.scale)
        .attr("xlink:href", 'https://a.tiles.mapbox.com/v4/marker/pin-m+4078c0.png?access_token=pk.eyJ1IjoiZ2l0aHViIiwiYSI6IjEzMDNiZjNlZGQ5Yjg3ZjBkNGZkZWQ3MTIxN2FkODIxIn0.o0lbEdOfJYEOaibweUDlzA');

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
        .attr("font-size", 15 / proj.scale)
        .attr("dy", "0")
        .text(function (d) {
          return d.name;
        });
    });

    this.placesSbj.subscribe(places => {
      cities = <any>places;
      console.log(`cities`, cities);
      let bounds = [];
      cities.forEach(city => bounds.push([city.geometry.location.lat(), city.geometry.location.lng()]));
      citiesOverlay.addTo(map);
      if (bounds.length > 0) {
        map.flyToBounds(bounds, { maxZoom: 8 });
      } else {
        map.setView(map.options.center, map.options.zoom);
      };
    })
  }

  ngOnDestroy() {
  }

}
