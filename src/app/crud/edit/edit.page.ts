import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Storage } from "@ionic/storage";

import { ApiRestService } from "../../services/api-rest.service";
import { MessagesService } from "../../services/messages.service";

@Component({
  selector: "app-edit",
  templateUrl: "./edit.page.html",
  styleUrls: ["./edit.page.scss"]
})
export class EditPage implements OnInit {
  private token: string;

  private idActividad: number;
  title: string;
  description: string;
  date: any;
  priority: string;

  constructor(
    private apiRest: ApiRestService,
    private message: MessagesService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private storage: Storage
  ) {}

  async ngOnInit() {
    this.token = await this.storage.get("token");
    this.idActividad = parseInt(this.actRoute.snapshot.paramMap.get("id"));
    this.initForm();
  }

  private async initForm() {
    let loading = await this.message.presentLoading("Cargando datos");
    await loading.present();
    this.apiRest.showActivity(this.idActividad, this.token).subscribe(
      (res: any) => {
        loading.dismiss();
        if (res.success) {
          var act = res.activity;
          this.title = act.title;
          this.description = act.description;
          this.date = act.date;
          this.priority = act.priority;
        }
      },
      error => {
        loading.dismiss();
        this.message.presentToast("Error al cargar los datos", 5000);
        this.router.navigateByUrl("list");
      }
    );
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
      this.apiRest.editActivity(this.idActividad, body).subscribe(
        (res: any) => {
          loading.dismiss();
          if (res.success) {
            this.message.presentToast("Actividad actualizada");
            this.router.navigateByUrl("list");
          }
        },
        error => {
          loading.dismiss();
          this.message.presentToast("Error al actualizar la actividad", 5000);
        }
      );
    } else {
      loading.dismiss();
      this.message.presentToast("Ingrese todos los campos", 5000);
    }
  }
}
