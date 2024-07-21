import { Component, Input, OnChanges, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {
  @Input() userId: number;
  @Output() userUpdated = new EventEmitter<void>();
  @ViewChild('updateUserModal') updateUserModal: any;

  updateUserForm: FormGroup;

  constructor( 
    private fb: FormBuilder,
    private userService: UserService) { 
      this.updateUserForm = this.fb.group({
        name: ['', Validators.required],
        surname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        phone: ['', Validators.required],
        rol: ['', Validators.required],
     });
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe(data => {
        this.updateUserForm.patchValue({
          name: data.name,
          surname: data.surname,
          email: data.email,
          password: data.password,
          phone: data.phone,
          rol: data.rol,
        });
      });
    }
  }

  onSubmit() {
    if (this.updateUserForm.valid) {
      const updatedUser = {
        id: this.userId,
        name: this.updateUserForm.value.name,
        surname: this.updateUserForm.value.surname,
        email: this.updateUserForm.value.email,
        password: this.updateUserForm.value.password,
        phone: this.updateUserForm.value.phone,
        rol: this.updateUserForm.value.rol,
      };
      
      this.userService.updateUser(this.userId, updatedUser).subscribe(
        response => {
          console.log('Kullanıcı başarıyla güncellendi', response);
          this.userUpdated.emit(); // Kullanıcı güncellendi olayı yayılıyor
          this.closeUpdateUserModel();
        },
        error => {
          console.error('Kullanıcı güncellenirken hata oluştu', error);
        }
      );
    } else {
      console.error('Form is invalid');
      // Form kontrol durumlarını loglayın
      console.log(this.updateUserForm.controls);
      // Her kontrolün geçerlilik durumunu loglayın
      Object.keys(this.updateUserForm.controls).forEach(key => {
        const controlErrors: ValidationErrors | null = this.updateUserForm.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
    }
  }
  

  closeUpdateUserModel(): void {
    if (this.updateUserForm) {
      const modal: any = new bootstrap.Modal(this.updateUserModal.nativeElement);
      modal.hide();
    }
  }
}