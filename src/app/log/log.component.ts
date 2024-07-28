import { Component, OnInit } from '@angular/core';
import { Log } from '../models/log';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { AuthService } from '../services/auth.service';
import { LogService } from '../services/log.service';


@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  logs: Log[] = [];

  constructor( 
    private authService: AuthService,
    private logService: LogService) { }
  

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
  // Export Excel Buttonu
  exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.logs);
    const workbook: XLSX.WorkBook = { Sheets: { 'logs': worksheet }, SheetNames: ['logs'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'logs');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';