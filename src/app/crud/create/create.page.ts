import { Component, OnInit } from "@angular/core";
import { ApiRestService } from "../../services/api-rest.service";
import { MessagesService } from "../../services/messages.service";
import { Storage } from "@ionic/storage";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-create",
  templateUrl: "./create.page.html",
  styleUrls: ["./create.page.scss"]
})
export class CreatePage implements OnInit {
  private token: string;

  title: string;
  description: string;
  date: any;
  priority: string;

  constructor(
    private apiRest: ApiRestService,
    private storage: Storage,
    private navCtrl: NavController,
    private message: MessagesService
  ) {}

  ngOnInit() {
    this.storage.get("token").then(res => {
      this.token = res;
    });
  }

  async guardar() {
    let online = window.navigator.onLine;
    if (!online) {
      this.message.presentToast("No tiene conexión a Internet", 3000);
      return;
    }
    let loading = await this.message.presentLoading("Guardando");
    await loading.present();
    if (
      this.title != null &&
      this.description != null &&
      this.date != null &&
      this.priority != null
    ) {
      let body = {
        title: this.title,
        description: this.description,
        date: this.date,
        priority: this.priority,
        token: this.token
      };
      this.apiRest.createActivity(body).subscribe(
        (res: any) => {
          loading.dismiss();
          if (res.success) {
            this.message.presentToast("Actividad registrada");
            this.navCtrl.pop();
          }
        },
        error => {
          loading.dismiss();
          this.message.presentToast("Error al registrar la actividad", 5000);
        }
      );
    } else {
      loading.dismiss();
      this.message.presentToast("Ingrese todos los campos", 5000);
    }
  }
}
