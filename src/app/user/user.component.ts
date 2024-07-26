import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { UserService } from '../services/user.service';
import { UserUpdateComponent } from './user-update/user-update.component';
import { UserAddComponent } from './user-add/user-add.component';
import * as bootstrap from 'bootstrap';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @ViewChild(UserUpdateComponent) updateComponent: UserUpdateComponent;
  @ViewChild(UserAddComponent) addComponent: UserAddComponent;

  users: User[] = [];
  selectedUserId: number | null = null;

  constructor(
    private http: HttpClient, 
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.getUsers();
  }

    getUsers() {
      const userId = this.authService.getCurrentUserId();
      const userRole = this.authService.getRole();

      if (userRole === 'admin') {
        this.userService.getAllUsers().subscribe((data) => {
          this.users = data;
          this.users.forEach(user => user.selected = false);
        });
      }else if (userId) {
        this.userService.getUsers().subscribe((data) => {
          this.users = data;
          this.users.forEach(user => user.selected = false);
        });
    }
  }
  onUserAdded() {
    this.getUsers();
    this.refreshUserList();

  }

  onUserUpdated() {
    this.getUsers();
    this.closeUpdateModal();
  }

  openUpdateModal(userId: number) {
    this.selectedUserId = userId;
    this.updateComponent.userId = userId;
    this.updateComponent.ngOnChanges();
    const modalElement = document.getElementById('updateUserModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  

  private closeUpdateModal(): void {
    const modal = document.getElementById('updateTasinmazModal');
    if (modal) {
      (modal as any).modal('hide');
    }
  }


  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          console.log('User deleted successfully');
          this.refreshUserList();},
        error => {
          console.error('Error deleting user', error);
        }
      );
    }
  }

  refreshUserList(): void {
    this.userService.getUsers().subscribe(
      data => {
        this.users = data;
      },
      error => {
        console.error('Kullanıcılar yüklenirken hata oluştu', error);
      }
    );
  }


  // Export Excel Buttonu
  exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.users);
    const workbook: XLSX.WorkBook = { Sheets: { 'users': worksheet }, SheetNames: ['users'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'users');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
