import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { UserService } from "src/app/services/user.service";
import * as bootstrap from "bootstrap";
import { AlertifyService } from "src/app/services/alertify.service";

@Component({
  selector: "app-user-update",
  templateUrl: "./user-update.component.html",
  styleUrls: ["./user-update.component.css"],
})
export class UserUpdateComponent implements OnChanges {
  @Input() userId: number;
  @Output() userUpdated = new EventEmitter<void>();
  @ViewChild("updateUserModal") updateUserModal: any;

  updateUserForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private alertifyService: AlertifyService
  ) {
    this.updateUserForm = this.fb.group({
      name: ["", Validators.required],
      surname: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      phone: ["", Validators.required],
      role: ["", Validators.required], // Burada `rol` yerine `role` kullanılmalı
    });
  }

  ngOnChanges() {
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe((data) => {
        this.updateUserForm.patchValue({
          name: data.name,
          surname: data.surname,
          email: data.email,
          password: data.password,
          phone: data.phone,
          role: data.role, // Burada da `rol` yerine `role` kullanılmalı
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
        role: this.updateUserForm.value.role, // `role` doğru şekilde alınıyor
      };

      this.userService.updateUser(this.userId, updatedUser).subscribe(
        (response) => {
          console.log("Kullanıcı başarıyla güncellendi", response);
          this.userUpdated.emit(); // Kullanıcı güncellendi olayı yayılıyor
          this.alertifyService.success("Kullanıcı başarıyla güncellendi");
        },
        (error) => {
          console.error("Kullanıcı güncellenirken hata oluştu", error);
          this.alertifyService.error("Kullanıcı güncellenirken hata oluştu");
        }
      );
    } else {
      console.error("Form is invalid");
      this.alertifyService.error("Form geçersiz. Lütfen kontrol edin.");
      Object.keys(this.updateUserForm.controls).forEach((key) => {
        const controlErrors: ValidationErrors | null =
          this.updateUserForm.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach((keyError) => {
            console.log(
              "Key control: " +
                key +
                ", keyError: " +
                keyError +
                ", err value: ",
              controlErrors[keyError]
            );
          });
        }
      });
    }
  }

  closeUpdateUserModel(): void {
    if (this.updateUserForm) {
      const modal: any = new bootstrap.Modal(
        this.updateUserModal.nativeElement
      );
      modal.hide();
    }
  }
}
