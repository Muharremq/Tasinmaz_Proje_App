import { Component, Input, OnChanges, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TasinmazService } from '../services/tasinmaz.service';
import { IlService } from '../services/il.service';
import { IlceService } from '../services/ilce.service';
import { MahalleService } from '../services/mahalle.service';
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
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnChanges, OnInit, OnDestroy {
  @Input() tasinmazId: number;
  @Output() tasinmazUpdated = new EventEmitter<void>(); // Define EventEmitter

  updateTasinmazForm: FormGroup;
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
    private authService: AuthService
  ) {
    this.updateTasinmazForm = this.fb.group({
      isim: ['', Validators.required],
      il: ['', Validators.required],
      ilce: ['', Validators.required],
      mahalle: ['', Validators.required],
      adres: ['', Validators.required],
      ada: ['', Validators.required],
      parsel: ['', Validators.required],
      nitelik: ['', Validators.required],
      koordinatX: ['', Validators.required],
      koordinatY: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadIller();
  }

  ngOnChanges() {
    if (this.tasinmazId) {
      this.tasinmazService.getTasinmazById(this.tasinmazId).subscribe(data => {
        this.updateTasinmazForm.patchValue({
          isim: data.name,
          il: data.mahalle.ilce.il.id,
          ilce: data.mahalle.ilce.id,
          mahalle: data.mahalle.id,
          adres: data.adres,
          ada: data.ada,
          parsel: data.parsel,
          nitelik: data.nitelik,
          koordinatX: data.koordinatX,
          koordinatY: data.koordinatY,
        });

        this.onIlChange(data.mahalle.ilce.il.id, data.mahalle.ilce.id, data.mahalle.id);
      });
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

  onIlChange(ilId: number, ilceId?: number, mahalleId?: number): void {
    this.selectedIl = ilId;
    this.loadIlceler(ilId, ilceId, mahalleId);
    this.updateTasinmazForm.patchValue({ ilce: null, mahalle: null });
  }

  onIlceChange(ilceId: number, mahalleId?: number): void {
    this.selectedIlce = ilceId;
    this.loadMahalleler(ilceId, mahalleId);
    this.updateTasinmazForm.patchValue({ mahalle: null });
  }

  loadIlceler(ilId: number, ilceId?: number, mahalleId?: number): void {
    this.ilceService.getIlcelerByIlId(ilId).subscribe(
      (data) => {
        this.ilceler = data;
        if (ilceId) {
          this.updateTasinmazForm.patchValue({ ilce: ilceId });
          this.onIlceChange(ilceId, mahalleId);
        }
      },
      (error) => {
        console.error('İlçeler yüklenirken hata oluştu', error);
      }
    );
  }

  loadMahalleler(ilceId: number, mahalleId?: number): void {
    this.mahalleService.getMahallelerByIlceId(ilceId).subscribe(
      (data) => {
        this.mahalleler = data;
        if (mahalleId) {
          this.updateTasinmazForm.patchValue({ mahalle: mahalleId });
        }
      },
      (error) => {
        console.error('Mahalleler yüklenirken hata oluştu', error);
      }
    );
  }

  onSubmit() {
    if (this.updateTasinmazForm.valid) {
      const formData = this.updateTasinmazForm.value;
      const userId = this.authService.getCurrentUserId(); // userId'yi alın
      if (userId) {
        const updatedTasinmaz = {
          id: this.tasinmazId,
          name: formData.isim,
          ada: formData.ada,
          parsel: formData.parsel,
          nitelik: formData.nitelik,
          koordinatX: formData.koordinatX,
          koordinatY: formData.koordinatY,
          mahalleId: formData.mahalle,
          adres: formData.adres,
          userId: userId // userId'yi ekleyin
        };

        this.tasinmazService.updateTasinmaz(this.tasinmazId, updatedTasinmaz).subscribe(
          response => {
            console.log('Taşınmaz başarıyla güncellendi', response);
            this.tasinmazUpdated.emit(); // Emit the event
            this.closeUpdateModal();
          },
          error => {
            console.error('Taşınmaz güncellenirken hata oluştu', error);
          }
        );
      } else {
        console.error('User ID bulunamadı');
      }
    }
  }

  private closeUpdateModal(): void {
    const modal = document.getElementById('updateTasinmazModal');
    if (modal) {
      (modal as any).modal('hide');
      this.ngOnDestroy();
    }
  }

  openMap(): void {
    this.showMap = true;
    setTimeout(() => this.initializeMap(), 0);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.setTarget(null);
      this.map = undefined;
    }
  }
  initializeMap(): void {
    if (this.map) {
      this.map.setTarget(null); // Harita zaten başlatılmışsa hedefi kaldır
      this.map = undefined;
    }

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

  onCoordinateSelected(coords: Coordinate): void {
    this.selectedCoordinate = {
      lon: coords[0],
      lat: coords[1],
    };
    this.updateTasinmazForm.patchValue({
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
      this.updateTasinmazForm.patchValue({ koordinatX, koordinatY });
      localStorage.removeItem('koordinatX');
      localStorage.removeItem('koordinatY');
    }
  }

  onMapClick(event: { lon: number; lat: number }) {
    this.updateTasinmazForm.patchValue({
      koordinatX: event.lon,
      koordinatY: event.lat
    });
  }
}
