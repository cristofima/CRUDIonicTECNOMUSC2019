import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiRestService } from "../../services/api-rest.service";
import { MessagesService } from "../../services/messages.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from "@angular/forms";

import { MenuController } from "@ionic/angular";
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  userForm: FormGroup;

  emailControl: AbstractControl;
  passwordControl: AbstractControl;

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private menuCtrl: MenuController,
    private apiRest: ApiRestService,
    private message: MessagesService,
    private storage: Storage
  ) {
    this.menuCtrl.enable(false);
  }

  goRegister() {
    this.router.navigate(["register"]);
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.userForm = this.formBuilder.group({
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
        Validators.compose([Validators.required, Validators.maxLength(25)])
      ]
    });
    this.emailControl = this.userForm.controls["email"];
    this.passwordControl = this.userForm.controls["password"];
  }

  async login() {
    let online = window.navigator.onLine;
    if (!online) {
      this.message.presentToast("No tiene conexión a Internet", 3000);
      return;
    }
    let loading = await this.message.presentLoading("Cargando");
    await loading.present();
    let body = {
      email: this.emailControl.value,
      password: this.passwordControl.value
    };
    this.apiRest.login(body).subscribe(
      (res: any) => {
        loading.dismiss();
        if (res) {
          if (res.success) {
            this.storage.set("token", res.token);
            this.router.navigateByUrl("list");
          } else {
            this.message.presentToast(
              "E-mail y/o contraseña incorrectos",
              5000
            );
          }
        }
      },
      error => {
        console.error(error);
        loading.dismiss();
        this.message.presentToast("Error al acceder", 5000);
      }
    );
  }
}
