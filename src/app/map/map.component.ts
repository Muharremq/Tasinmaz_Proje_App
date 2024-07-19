import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Output() coordinateSelected = new EventEmitter<{ lon: number, lat: number }>();

  private map: Map;
  private vectorSource: VectorSource = new VectorSource();

  ngOnInit(): void {
    this.initializeMap();
  }

  initializeMap(): void {
    this.map = new Map({
      target: 'map-container',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        new VectorLayer({
          source: this.vectorSource,
          style: new Style({
            image: new CircleStyle({
              radius: 7,
              fill: new Fill({ color: 'red' }),
              stroke: new Stroke({
                color: 'black',
                width: 2,
              }),
            }),
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([35.2433, 38.9637]),
        zoom: 6,
      }),
    });

    this.map.on('click', (event) => {
      const coordinates = toLonLat(event.coordinate);
      this.addMarker(coordinates);
      this.coordinateSelected.emit({ lon: coordinates[0], lat: coordinates[1] });
    });
  }

  addMarker(coordinates: [number, number]): void {
    const marker = new Feature({
      geometry: new Point(fromLonLat(coordinates)),
    });
    this.vectorSource.clear();
    this.vectorSource.addFeature(marker);
  }
}
