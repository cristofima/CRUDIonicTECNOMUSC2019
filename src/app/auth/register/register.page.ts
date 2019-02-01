import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl
} from "@angular/forms";

import { Router } from "@angular/router";

import { ApiRestService } from "../../services/api-rest.service";
import { MessagesService } from "../../services/messages.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"]
})
export class RegisterPage implements OnInit {
  userForm: FormGroup;

  nameControl: AbstractControl;
  emailControl: AbstractControl;
  passwordControl: AbstractControl;
  confirmPasswordControl: AbstractControl;

  constructor(
    private formBuilder: FormBuilder,
    private apiRest: ApiRestService,
    private router: Router,
    private message: MessagesService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.userForm = this.formBuilder.group({
      name: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30)
        ])
      ],
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.maxLength(50)
        ])
      ],
      password: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!$%&?@#\._-])(?=.*[0-9])[\w!$%&?@#\.-]{8,25}$/
          ),
          Validators.minLength(8),
          Validators.maxLength(25)
        ])
      ],
      confirm_password: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!$%&?@#\._-])(?=.*[0-9])[\w!$%&?@#\.-]{8,25}$/
          ),
          Validators.minLength(8),
          Validators.maxLength(25),
          this.checkPassword()
        ])
      ]
    });
    this.nameControl = this.userForm.controls["name"];
    this.passwordControl = this.userForm.controls["password"];
    this.emailControl = this.userForm.controls["email"];
    this.confirmPasswordControl = this.userForm.controls["confirm_password"];
  }

  async guardar() {
    let online = window.navigator.onLine;
    if (!online) {
      this.message.presentToast("No tiene conexión a Internet", 3000);
      return;
    }
    let loading = await this.message.presentLoading("Cargando");
    await loading.present();
    let body = {
      name: String(this.nameControl.value),
      email: String(this.emailControl.value),
      password: String(this.passwordControl.value)
    };

    this.apiRest.register(body).subscribe(
      (res: any) => {
        loading.dismiss();
        if (res.success) {
          this.message.presentToast("Usuario registrado");
          this.router.navigateByUrl("login");
        } else {
          this.message.presentToast("No se pudo registrar");
        }
      },
      error => {
        loading.dismiss();
        this.message.presentToast("Error al acceder", 5000);
      }
    );
  }

  checkPassword() {
    return (control: FormControl) => {
      if (control.value) {
        let value: string = control.value;
        let password: string = this.passwordControl.value;
        if (password == value) {
          return null;
        }
        return { equals: { valid: false } };
      } else {
        return null;
      }
    };
  }
}
