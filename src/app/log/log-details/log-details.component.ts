import { Component, OnInit } from '@angular/core';
import { LogService } from 'src/app/services/log.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { AuthService } from 'src/app/services/auth.service';
import { Log } from 'src/app/models/log';

@Component({
  selector: 'app-log-details',
  templateUrl: './log-details.component.html',
  styleUrls: ['./log-details.component.css']
})
export class LogDetailsComponent implements OnInit {

  logs: Log[] = [];
  searchTerm: string = '';
  page: number = 1;

  constructor( 
    private logService: LogService,
    private authService: AuthService) { }

  ngOnInit() {
    this.getLogs();
  }

  getLogs() {
    const userId = this.authService.getCurrentUserId();
    const userRole = this.authService.getRole();
  
    if (userRole === 'admin' || userId) {
      this.logService.getAllLogs().subscribe((data: Log[]) => {
        this.logs = data;
        this.logs.forEach(log => log.selected = false);
      });
    }
  }

  searchLogs(): void {
    this.logService.searchLogs(this.searchTerm).subscribe(
      (data) => {
        this.logs = data;
      },
      (error) => {
        console.error('Hata:', error);
      }
    );
  }

  selectAll(event: any): void {
    this.logs.forEach(log => log.selected = event.target.checked);
  }

  // Export Excel Buttonu
  exportToExcel() {
    const selectedLogs = this.logs.filter(log => log.selected);
    if (selectedLogs.length === 0) {
      alert('No logs selected for export.');
      return;
    }
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedLogs);
    const workbook: XLSX.WorkBook = { Sheets: { 'logs': worksheet }, SheetNames: ['logs'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'selected_logs');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';