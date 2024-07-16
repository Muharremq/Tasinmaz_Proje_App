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
          isim: data.mahalle.ilce.il.name,
          il: data.mahalle.ilce.il.name,
          ilce: data.mahalle.ilce.name,
          mahalle: data.mahalle.name,
          ada: data.ada,
          parsel: data.parsel,
          nitelik: data.nitelik,
          koordinatBilgileri: data.koordinatBilgileri
        });

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

  onIlChange(ilId: number): void {
    this.selectedIl = ilId;
    this.loadIlceler(ilId);
    this.updateTasinmazForm.patchValue({ ilce: null, mahalle: null });
  }

  onIlceChange(ilceId: number): void {
    this.selectedIlce = ilceId;
    this.loadMahalleler(ilceId);
    this.updateTasinmazForm.patchValue({ mahalle: null });
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

  onSubmit() {
    console.log(this.updateTasinmazForm.value);
    // Güncelleme işlemi burada yapılabilir.
  }
}
