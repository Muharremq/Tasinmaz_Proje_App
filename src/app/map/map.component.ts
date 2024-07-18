import { Component, OnInit } from '@angular/core';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';




@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  map: Map;
  constructor() { }

  ngOnInit() {
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center:fromLonLat([35.2433, 38.9637]),
        zoom: 5.8
      })
    });
    this.map.on('pointermove', this.displayCoordinates.bind(this));
  }

  displayCoordinates(event) {
    const coordinates = toLonLat(this.map.getEventCoordinate(event.originalEvent));
    const lon = coordinates[0].toFixed(6);
    const lat = coordinates[1].toFixed(6);
    const coordElement = document.getElementById('coordinates');
    coordElement.innerHTML = `Koordinatlar: Enlem: ${lat}, Boylam: ${lon}`;
  }

}
