import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Storage } from "@ionic/storage";

import { ApiRestService } from "./services/api-rest.service";
import { MessagesService } from "./services/messages.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent {
  private token: string;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private router: Router,
    private apiRest: ApiRestService,
    private message: MessagesService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.checkLogin();
    });
  }

  private checkLogin() {
    this.storage
      .get("token")
      .then(res => {
        if (res != null) {
          this.token = res;
          this.apiRest.getUser(res).subscribe(
            () => {
              this.router.navigateByUrl("list");
            },
            error => {
              this.storage.clear();
              this.message.presentToast("Su token ha expirado", 5000);
            }
          );
        } else {
          this.token = null;
        }
      })
      .catch(e => {
        console.error(e);
      });
  }

  async salir() {
    let loading = await this.message.presentLoading("Saliendo");
    loading.present();
    this.apiRest.logout({ token: this.token }).subscribe(
      (res: any) => {
        loading.dismiss();
        if (res.success) {
          this.storage.clear();
          this.router.navigateByUrl("login");
          this.message.presentToast("Sesión finalizada");
        } else {
          this.message.presentToast("No se pudo salir", 5000);
        }
      },
      error => {
        loading.dismiss();
        this.message.presentToast("Error al salir", 5000);
      }
    );
  }
}
