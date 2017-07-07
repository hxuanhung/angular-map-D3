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

    let cities = [];
    let citiesOverlay = L.d3SvgOverlay(function (sel, proj) {
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

    this.placesSbj.subscribe(places => {
      cities = <any>places;
      citiesOverlay.addTo(map);
      // this.cd.markForCheck();
    })
  }

  ngOnDestroy() {
  }

}
