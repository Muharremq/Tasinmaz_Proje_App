import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Tasinmaz } from "../models/tasinmaz";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { AddComponent } from '../add/add.component';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  @ViewChild(AddComponent) addComponent: AddComponent;
  tasinmazlar: Tasinmaz[] = [];
  selectedTasinmazId: number | null = null; // Burada `selectedTasinmazId` tanımlıyoruz

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getTasinmazlar();
  }

  getTasinmazlar(){
    return this.http.get<Tasinmaz[]>("https://localhost:44348/api/TasinmazBilgi").subscribe((data) => {
      this.tasinmazlar = data;
      this.tasinmazlar.forEach(tasinmaz => tasinmaz.selected = false); // Her taşınmaz nesnesine `selected` alanını ekliyoruz
    });
  }

  onTasinmazAdded() {
    this.getTasinmazlar();
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
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
