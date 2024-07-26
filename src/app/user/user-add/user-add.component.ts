import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import * as bootstrap from 'bootstrap';
import { Router } from '@angular/router';

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
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.createAddUserForm();
  }

  createAddUserForm() {
    this.addUserForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  register() {
    if (this.addUserForm.valid) {
      const registerUser = Object.assign({}, this.addUserForm.value);
      this.authService.register(registerUser).subscribe(
        () => {
          this.userAdded.emit();
          const modalElement = this.addUserModal.nativeElement;
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          modalInstance.hide();
          this.resetForm();
          this.router.navigateByUrl('/user');
        },
        error => {
          console.error("User registration error: ", error);
        }
      );
    }
  }

  //reset form
  resetForm() {
    this.addUserForm.reset();
  }
}
