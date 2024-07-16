import { Component, OnInit } from '@angular/core';
import { IlService } from '../services/il.service';
import { IlceService } from '../services/ilce.service';
import { MahalleService } from '../services/mahalle.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  addTasinmazForm: FormGroup;
  iller: any[] = [];
  ilceler: any[] = [];
  mahalleler: any[] = [];
  selectedIl: number;
  selectedIlce: number;

  constructor(
    private fb: FormBuilder,
    private ilService: IlService,
    private ilceService: IlceService,
    private mahalleService: MahalleService
  ) {
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

  ngOnInit() {
    this.loadIller();

    const modalElement = document.getElementById('addTasinmazModal');
    if (modalElement) {
      modalElement.addEventListener('show.bs.modal', () => this.resetForm());
      modalElement.addEventListener('hide.bs.modal', () => this.resetForm());
    }
  }

  
  loadIller() {
    this.ilService.getIller().subscribe(
      (data) => {
        this.iller = data;
        // İller alfabetik sıraya göre sıralanabilir
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

  // Reset the form
  resetForm(): void {
    this.addTasinmazForm.reset();
    this.selectedIl = null;
    this.selectedIlce = null;
    this.ilceler = [];
    this.mahalleler = [];
  }
}
