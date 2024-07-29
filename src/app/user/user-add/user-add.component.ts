import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from "src/app/services/user.service";
import { AuthService } from "src/app/services/auth.service";
import * as bootstrap from "bootstrap";
import { Router } from "@angular/router";

@Component({
  selector: "app-user-add",
  templateUrl: "./user-add.component.html",
  styleUrls: ["./user-add.component.css"],
})
export class UserAddComponent implements OnInit {
  @Output() userAdded = new EventEmitter<void>();
  @ViewChild("addUserModal") addUserModal: ElementRef;

  addUserForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.createAddUserForm();
  }

  ngAfterViewInit() {
    const modalElement = this.addUserModal.nativeElement;
    modalElement.addEventListener("hidden.bs.modal", () => {
      this.resetForm();
      const modalBackdrop = document.querySelector(".modal-backdrop");
      if (modalBackdrop) {
        modalBackdrop.remove();
      }
    });
  }

  createAddUserForm() {
    this.addUserForm = this.fb.group({
      name: ["", Validators.required],
      surname: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, this.passwordValidator]],
      phone: ["", Validators.required],
      role: ["", Validators.required],
    });
  }

  passwordValidator(control) {
    const password = control.value;
    if (!password) {
      return null;
    }
    const hasLength = password.length >= 8;
    const hasNumber = /[0-9]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const valid = hasNumber && hasUpper && hasLower && hasSpecial && hasLength;
    if (!valid) {
      return { passwordInvalid: true };
    }
    return null;
  }

  register() {
    if (this.addUserForm.valid) {
      const registerUser = Object.assign({}, this.addUserForm.value);
      this.authService.register(registerUser).subscribe(
        () => {
          this.userAdded.emit();
          this.closeModal();
          this.router.navigate(["/user"]).then(() => {
            console.log("Navigated to user page");
          });
        },
        (error) => {
          console.error("User registration error: ", error);
        }
      );
    }
  }

  closeModal(): void {
    const modalElement = this.addUserModal.nativeElement;
    const modalInstance = new bootstrap.Modal(modalElement); // Modal instance alıyoruz
    modalInstance.hide(); // Modalı kapatıyoruz
    this.resetForm(); // Formu sıfırlıyoruz
  }

  resetForm() {
    this.addUserForm.reset();
    this.addUserForm.markAsPristine();
    this.addUserForm.markAsUntouched();
    this.addUserForm.updateValueAndValidity();
  }
}
