import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IlService } from '../services/il.service';
import { IlceService } from '../services/ilce.service';
import { MahalleService } from '../services/mahalle.service';
import { TasinmazService } from '../services/tasinmaz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tasinmaz } from '../models/tasinmaz';
import { Map, View } from 'ol';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import { Coordinate } from 'ol/coordinate';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  @Output() tasinmazAdded = new EventEmitter<void>();
  @ViewChild('addTasinmazModal') addTasinmazModal: ElementRef;

  addTasinmazForm: FormGroup;
  iller: any[] = [];
  ilceler: any[] = [];
  mahalleler: any[] = [];
  selectedIl: number;
  selectedIlce: number;
  showMap = false;
  selectedCoordinate: { lon: number, lat: number } | null = null;
  private map: Map | undefined;
  private vectorSource: VectorSource = new VectorSource();
  initialCenter = fromLonLat([35.2433, 38.9637]);
  initialZoom = 2;

  constructor(
    private fb: FormBuilder,
    private tasinmazService: TasinmazService,
    private ilService: IlService,
    private ilceService: IlceService,
    private mahalleService: MahalleService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadIller();

    this.addTasinmazForm = this.fb.group({
      isim: ['', Validators.required],
      il: ['', Validators.required],
      ilce: ['', Validators.required],
      mahalle: ['', Validators.required],
      adres: ['', Validators.required],
      ada: ['', Validators.required],
      parsel: ['', Validators.required],
      nitelik: ['', Validators.required],
      koordinatX: ['', Validators.required],
      koordinatY: ['', Validators.required]
    });
    this.checkForCoordinates();
  }

  onSubmit(): void {
    if (this.addTasinmazForm.valid) {
      const formData = this.addTasinmazForm.value;
      const tasinmaz: Tasinmaz = {
        id: 0,
        name: formData.isim,
        ada: formData.ada,
        parsel: formData.parsel,
        nitelik: formData.nitelik,
        koordinatX: formData.koordinatX,
        koordinatY: formData.koordinatY,
        mahalleId: formData.mahalle,
        adres: formData.adres,
        mahalle: null,
        selected: false
      };

      this.tasinmazService.addTasinmaz(tasinmaz).subscribe(
        (response) => {
          console.log('Taşınmaz başarıyla eklendi', response);
          this.addTasinmazForm.reset();
          this.tasinmazAdded.emit();
          this.closeModal();
        },
        (error) => {
          console.error('Taşınmaz eklenirken hata oluştu', error);
        }
      );
    }
  }

  loadIller() {
    this.ilService.getIller().subscribe(
      (data) => {
        this.iller = data;
        this.iller.sort((a, b) => a.name.localeCompare(b.name));
      },
      (error) => {
        console.error('İller yüklenirken hata oluştu', error);
      }
    );
  }

  onIlChange(ilId: number): void {
    this.selectedIl = ilId;
    this.loadIlceler(ilId);
  }

  onIlceChange(ilceId: number): void {
    this.selectedIlce = ilceId;
    this.loadMahalleler(ilceId);
  }

  loadIlceler(ilId: number): void {
    this.ilceService.getIlcelerByIlId(ilId).subscribe(
      (data) => {
        this.ilceler = data;
      },
      (error) => {
        console.error('İlçeler yüklenirken hata oluştu', error);
      }
    );
  }

  loadMahalleler(ilceId: number): void {
    this.mahalleService.getMahallelerByIlceId(ilceId).subscribe(
      (data) => {
        this.mahalleler = data;
      },
      (error) => {
        console.error('Mahalleler yüklenirken hata oluştu', error);
      }
    );
  }

  resetForm(): void {
    this.addTasinmazForm.reset();
    this.selectedIl = null;
    this.selectedIlce = null;
    this.ilceler = [];
    this.mahalleler = [];
  }

  ngAfterViewInit(): void {
    if (this.showMap) {
      this.initializeMap();
    }
  }

  openMap(): void {
    this.showMap = true;
    setTimeout(() => this.initializeMap(), 0); // Harita başlatmayı geciktiriyoruz
  }

  initializeMap(): void {
    if (this.map) {
      this.map.setTarget('map-container'); // Harita zaten başlatılmışsa hedefi değiştir
    } else {
      this.map = new Map({
        target: 'map-container',
        layers: [
          new Tile({
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
          center: fromLonLat([0, 0]), // Başlangıç merkezi
          zoom: 2 // Başlangıç zoom seviyesi
        })
      });

      this.map.on('click', (event) => {
        const coords = toLonLat(event.coordinate);
        this.onCoordinateSelected(coords);
      });
    }
  }

  onCoordinateSelected(coords: Coordinate): void {
    this.selectedCoordinate = {
      lon: coords[0],
      lat: coords[1],
    };
    this.addTasinmazForm.patchValue({
      koordinatX: this.selectedCoordinate.lon,
      koordinatY: this.selectedCoordinate.lat
    });

    // Yeni işaretçi ekleyin
    const feature = new Feature({
      geometry: new Point(fromLonLat([this.selectedCoordinate.lon, this.selectedCoordinate.lat])),
    });
    this.vectorSource.clear(); // Önceki işaretçileri temizle
    this.vectorSource.addFeature(feature);

    this.showMap = false;
  }

  checkForCoordinates() {
    const koordinatX = localStorage.getItem('koordinatX');
    const koordinatY = localStorage.getItem('koordinatY');
    if (koordinatX && koordinatY) {
      this.addTasinmazForm.patchValue({ koordinatX, koordinatY });
      localStorage.removeItem('koordinatX');
      localStorage.removeItem('koordinatY');
    }
  }

  closeModal() {
    const modal = document.getElementById('addTasinmazModal');
    if (modal) {
      (modal as any).modal('hide');
    }
  }

  onMapClick(event: { lon: number; lat: number }) {
    this.addTasinmazForm.patchValue({
      koordinatX: event.lon,
      koordinatY: event.lat
    });
  }
}
