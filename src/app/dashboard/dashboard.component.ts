import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tasinmaz } from '../models/tasinmaz';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { AddComponent } from '../add/add.component';
import { UpdateComponent } from '../update/update.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(AddComponent) addComponent: AddComponent;
  @ViewChild(UpdateComponent) updateComponent: UpdateComponent;
  tasinmazlar: Tasinmaz[] = [];
  selectedTasinmazId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getTasinmazlar();
  }

  getTasinmazlar() {
    this.http.get<Tasinmaz[]>('https://localhost:44348/api/TasinmazBilgi').subscribe((data) => {
      this.tasinmazlar = data;
      this.tasinmazlar.forEach(tasinmaz => tasinmaz.selected = false);
    });
  }

  onTasinmazAdded() {
    this.getTasinmazlar();
    this.closeAddModal();
  }

  openAddModal() {
    this.addComponent.resetForm();
    const modal = document.getElementById('addTasinmazModal');
    if (modal) {
      (modal as any).modal('show');
    }
  }

  onTasinmazUpdated() {
    this.getTasinmazlar();
    this.closeUpdateModal(); // Close the modal after update
  }

  openDeleteModal(tasinmazId: number) {
    this.selectedTasinmazId = tasinmazId;
  }

  onTasinmazDeleted(tasinmazId: number) {
    this.tasinmazlar = this.tasinmazlar.filter(t => t.id !== tasinmazId);
  }

  selectAll(event: any) {
    const isChecked = event.target.checked;
    this.tasinmazlar.forEach(tasinmaz => tasinmaz.selected = isChecked);
  }

  openUpdateModal(tasinmazId: number) {
    this.selectedTasinmazId = tasinmazId;
    this.updateComponent.tasinmazId = tasinmazId;
    this.updateComponent.ngOnChanges();
    const modal = document.getElementById('updateTasinmazModal');
    if (modal) {
      (modal as any).modal('show');
    }
  }

  exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tasinmazlar);
    const workbook: XLSX.WorkBook = { Sheets: { 'tasinmazlar': worksheet }, SheetNames: ['tasinmazlar'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'tasinmazlar');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  private closeAddModal(): void {
    const modal = document.getElementById('addTasinmazModal');
    if (modal) {
      (modal as any).modal('hide');
    }
  }

  private closeUpdateModal(): void {
    const modal = document.getElementById('updateTasinmazModal');
    if (modal) {
      (modal as any).modal('hide');
    }
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
