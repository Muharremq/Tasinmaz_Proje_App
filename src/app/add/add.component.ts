import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IlService } from '../services/il.service';
import { IlceService } from '../services/ilce.service';
import { MahalleService } from '../services/mahalle.service';
import { TasinmazService } from '../services/tasinmaz.service';
import { Router } from '@angular/router';
import { Tasinmaz } from '../models/tasinmaz';

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

  constructor(
    private fb: FormBuilder,
    private tasinmazService: TasinmazService,
    private ilService: IlService,
    private ilceService: IlceService,
    private mahalleService: MahalleService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadIller();

    this.addTasinmazForm = this.fb.group({
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

  onSubmit(): void {
    if (this.addTasinmazForm.valid) {
      const formData = this.addTasinmazForm.value;
      const tasinmaz: Tasinmaz = {
        id: 0,
        name: formData.isim,
        ada: formData.ada,
        parsel: formData.parsel,
        nitelik: formData.nitelik,
        koordinatBilgileri: formData.koordinatBilgileri,
        mahalleId: formData.mahalle,
        mahalle: null,
        selected: false
      };

      this.tasinmazService.addTasinmaz(tasinmaz).subscribe(
        (response) => {
          console.log('Taşınmaz başarıyla eklendi', response);
          this.addTasinmazForm.reset();
          this.tasinmazAdded.emit(); // Emit the event
          this.closeModal();
        },
        (error) => {
          console.error('Taşınmaz eklenirken hata oluştu', error);
        }
      );
    }
  }
  
  closeModal() {
    const modal = document.getElementById('addTasinmazModal');
    if (modal) {
      (modal as any).modal('hide');
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
}
