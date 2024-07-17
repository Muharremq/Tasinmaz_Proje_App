import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TasinmazService } from '../services/tasinmaz.service';
import { IlService } from '../services/il.service';
import { IlceService } from '../services/ilce.service';
import { MahalleService } from '../services/mahalle.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnChanges, OnInit {

  updateTasinmazForm: FormGroup;
  @Input() tasinmazId: number;
  iller: any[] = [];
  ilceler: any[] = [];
  mahalleler: any[] = [];
  selectedIl: number;
  selectedIlce: number;

  constructor(
    private fb: FormBuilder,
    private tasinmazService: TasinmazService,
    private ilService: IlService,
    private ilceService: IlceService,
    private mahalleService: MahalleService
  ) {
    this.updateTasinmazForm = this.fb.group({
      isim: ['', Validators.required],
      il: ['', Validators.required],
      ilce: ['', Validators.required],
      mahalle: ['', Validators.required],
      ada: ['', Validators.required],
      parsel: ['', Validators.required],
      nitelik: ['', Validators.required],
      koordinatBilgileri: ['', Validators.required]
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
          il: data.mahalle.ilce.il.id, // Use ID for dropdown selection
          ilce: data.mahalle.ilce.id, // Use ID for dropdown selection
          mahalle: data.mahalle.id, // Use ID for dropdown selection
          ada: data.ada,
          parsel: data.parsel,
          nitelik: data.nitelik,
          koordinatBilgileri: data.koordinatBilgileri
        });

        // Load related data after setting the initial value
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
          this.onIlceChange(ilceId, mahalleId); // Load mahalleler after setting ilce
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
      const updatedTasinmaz = {
        id: this.tasinmazId, // id'yi ekleyin
        name: this.updateTasinmazForm.value.isim,
        ada: this.updateTasinmazForm.value.ada,
        parsel: this.updateTasinmazForm.value.parsel,
        nitelik: this.updateTasinmazForm.value.nitelik,
        koordinatBilgileri: this.updateTasinmazForm.value.koordinatBilgileri,
        mahalleId: this.updateTasinmazForm.value.mahalle // mahalle id'sini doğru şekilde alın
      };
  
      console.log('Updated Tasinmaz:', updatedTasinmaz);  // Log the form value
    
      this.tasinmazService.updateTasinmaz(this.tasinmazId, updatedTasinmaz).subscribe(
        response => {
          console.log('Taşınmaz başarıyla güncellendi', response);
          // Formu kapat ve tabloyu yenile
        },
        error => {
          console.error('Taşınmaz güncellenirken hata oluştu', error);
        }
      );
    }
  }
  
  
}