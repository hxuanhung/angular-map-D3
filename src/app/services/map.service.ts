import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Location } from "../core/location.class";
import { Map } from "leaflet";

@Injectable()
export class MapService {
  public map: Map;
  public baseMaps: any;

  constructor(private http: Http) {
    this.baseMaps = {
      OpenStreetMap: L.tileLayer("http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
      })
    };
  }
}
