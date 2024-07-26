import { Component, OnInit } from '@angular/core';
import { Log } from '../models/log';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Xliff } from '@angular/compiler';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  logs: Log[] = [];

  constructor( private http: HttpClient, private authService: AuthService) { }

  private apiUrl = 'https://localhost:44348/api/Log'; // API URL
  
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
  }
  ngOnInit() {
    this.getlogs();
  }

 /* getlogs(){
    return this.http.get<Log[]>("https://localhost:44348/api/Log").subscribe((data) => {
      this.logs = data;
    });
  }*/

    getlogs() {
      const userId = this.authService.getCurrentUserId();
      const userRole = this.authService.getRole();

      if (userRole === 'admin') {
        this.getAllLogs().subscribe((data) => {
          this.logs = data;
          this.logs.forEach(log => log.selected = false);
        });
      }else if (userId) {
        this.getAllLogs().subscribe((data) => {
          this.logs = data;
          this.logs.forEach(log => log.selected = false);
        });
    }
  }

  getAllLogs(): Observable<Log[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.get<Log[]>(this.apiUrl, { headers });
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