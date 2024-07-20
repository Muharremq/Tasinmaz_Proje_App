import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {
  @Output() userAdded = new EventEmitter<void>();
  @ViewChild('addUserModal') addUserModal: ElementRef;

  addUserForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.addUserForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Add email validation
      password: ['', Validators.required],
      phone: ['', Validators.required],
      rol: ['', Validators.required], // Ensure this matches the API specification
    });
  }

  onSubmit(): void {
    if (this.addUserForm.valid) {
      const formData = this.addUserForm.value;
      const user: User = {
        id: 0,
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        rol: formData.rol, // Ensure this field matches the API specification
      };

      this.userService.addUser(user).subscribe(
        (response) => {
          console.log('Kullanıcı başarıyla eklendi.');
          this.addUserForm.reset();
          this.userAdded.emit();
          this.closeModal();
        },
        (error) => {
          console.log('Kullanıcı eklenirken hata oluştu.', error);
          // Handle specific validation errors
          if (error.status === 400) {
            if (error.error.errors.Rol) {
              console.log('Rol validation error:', error.error.errors.Rol);
            }
            if (error.error.errors.Email) {
              console.log('Email validation error:', error.error.errors.Email);
            }
          }
        }
      );
    }
  }

  resetForm(): void {
    this.addUserForm.reset();
  }

  closeModal(): void {
    this.addUserModal.nativeElement.click();
  }


}
