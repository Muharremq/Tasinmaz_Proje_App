import { Component, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import ScaleLine from 'ol/control/ScaleLine';
import XYZ from 'ol/source/XYZ';
import { defaults as defaultControls } from 'ol/control';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnChanges {
  @Input() mapId: string = 'map-container';
  @Input() coordinates: { lon: number, lat: number };
  @Input() propertyLocations: { lon: number, lat: number }[] = [];

  private map: Map;
  private vectorSource: VectorSource = new VectorSource();
  private initialCoordinates = fromLonLat([35.2433, 38.9637]);
  private initialZoom = 6.3;

  private osmLayer = new TileLayer({
    source: new OSM(),
    visible: true,
  });
  
  private googleLayer = new TileLayer({
    source: new XYZ({
      url: 'http://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
    }),
    visible: false,
  });

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.coordinates && changes.coordinates.currentValue) {
      const { lon, lat } = changes.coordinates.currentValue;
      this.setView(lon, lat);
    }
    if (changes.propertyLocations && changes.propertyLocations.currentValue) {
      this.addPropertyMarkers(changes.propertyLocations.currentValue);
    }
  }

  initializeMap(): void {
    this.map = new Map({
      target: this.mapId,
      layers: [
        this.osmLayer,
        this.googleLayer,
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
      controls: defaultControls().extend([
        new ScaleLine({
          units: 'metric', // or 'imperial'
          minWidth: 100,
          target: document.getElementById('scale-line'), // Ensure this targets the correct element
        }),
      ]),
    });

    this.map.on('click', (event) => {
      const coordinates = toLonLat(event.coordinate);
      this.addMarker(coordinates);
    });
  }

  addMarker(coordinates: [number, number]): void {
    const marker = new Feature({
      geometry: new Point(fromLonLat(coordinates)),
    });
    this.vectorSource.clear();
    this.vectorSource.addFeature(marker);
    //get coordinates
    const lon = coordinates[0].toFixed(6);
    const lat = coordinates[1].toFixed(6);
    const coordElement = document.getElementById('coordinates');
    if (coordElement) {
      coordElement.innerHTML = `Koordinatlar: Enlem: ${lat}, Boylam: ${lon}`;
    }
  }

  setView(lon: number, lat: number, zoom: number = 10): void {
    this.map.getView().setCenter(fromLonLat([lon, lat]));
    this.map.getView().setZoom(zoom);
    this.addMarker([lon, lat]);
  }

  setViewMap(lon: number, lat: number, zoom: number = 10): void {
    this.map.getView().setCenter(fromLonLat([lon, lat]));
    this.map.getView().setZoom(zoom);
  }

  toggleLayer(layer: string): void {
    if (layer === 'osm') {
      this.osmLayer.setVisible(true);
      this.googleLayer.setVisible(false);
    } else {
      this.osmLayer.setVisible(false);
      this.googleLayer.setVisible(true);
    }
  }

  changeOpacity(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.osmLayer.setOpacity(Number(value));
    this.googleLayer.setOpacity(Number(value));
  }

  addPropertyMarkers(locations: { lon: number, lat: number }[]): void {
    this.vectorSource.clear();
    locations.forEach(({ lon, lat }) => {
      const marker = new Feature({
        geometry: new Point(fromLonLat([lon, lat])),
      });
      this.vectorSource.addFeature(marker);
    });
  }

  //reset map method
  resetMap(): void {
    this.setViewMap(35.2433, 38.9637, 6.3);
  }
}
