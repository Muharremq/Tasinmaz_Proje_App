import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
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
export class MapComponent implements AfterViewInit {
  @Input() mapId: string = 'map-container';  // Add this line
  @Output() coordinateSelected = new EventEmitter<{ lon: number, lat: number }>();

  private map: Map;
  private vectorSource: VectorSource = new VectorSource();
  private initialCoordinates = fromLonLat([35.2433, 38.9637]);
  private initialZoom = 6.3;

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  initializeMap(): void {
    this.map = new Map({
      target: this.mapId,  // Change this line
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
        center: this.initialCoordinates,
        zoom: this.initialZoom,
      }),
    });

    this.map.on('click', (event) => {
      const coordinates = toLonLat(event.coordinate);
      this.addMarker(coordinates);
      this.coordinateSelected.emit({ lon: coordinates[0], lat: coordinates[1] });
      this.displayCoordinates(event);
    });
  }

  addMarker(coordinates: [number, number]): void {
    const marker = new Feature({
      geometry: new Point(fromLonLat(coordinates)),
    });
    this.vectorSource.clear();
    this.vectorSource.addFeature(marker);
  }

  displayCoordinates(event): void {
    const coordinates = toLonLat(this.map.getEventCoordinate(event.originalEvent));
    const lon = coordinates[0].toFixed(6);
    const lat = coordinates[1].toFixed(6);
    const coordElement = document.getElementById('coordinates');
    if (coordElement) {
      coordElement.innerHTML = `Koordinatlar: Enlem: ${lat}, Boylam: ${lon}`;
    }
  }

  resetMap(): void {
    this.map.getView().setCenter(this.initialCoordinates);
    this.map.getView().setZoom(this.initialZoom);
  }
}
