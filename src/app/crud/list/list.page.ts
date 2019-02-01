import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Storage } from "@ionic/storage";
import { AlertController } from "@ionic/angular";

import { ApiRestService } from "../../services/api-rest.service";
import { MessagesService } from "../../services/messages.service";

import { MenuController } from "@ionic/angular";

@Component({
  selector: "app-list",
  templateUrl: "list.page.html",
  styleUrls: ["list.page.scss"]
})
export class ListPage implements OnInit {
  public items = [];
  private token: string;
  private loading: any;

  listado = [];

  constructor(
    private apiRest: ApiRestService,
    private storage: Storage,
    private router: Router,
    private menuCtrl: MenuController,
    private alertController: AlertController,
    private message: MessagesService
  ) {
    this.menuCtrl.enable(true);
  }

  async ngOnInit() {
    this.loading = await this.message.presentLoading("Cargando");
    this.loading.present();
    this.storage.get("token").then(res => {
      this.token = res;
      this.getList();
    });
  }

  doRefresh(event) {
    this.getList(event);
  }

  private getList(event?) {
    let online = window.navigator.onLine;
    if (!online) {
      this.closeLoading();
      this.stopRefresh(event);
      this.message.presentToast("No tiene conexión a Internet", 5000);
      return;
    }
    this.apiRest.getActivities(this.token).subscribe(
      (res: any) => {
        this.closeLoading();
        this.listado = res.activities;
        this.stopRefresh(event);
      },
      error => {
        this.closeLoading();
        console.error(error);
        this.stopRefresh(event);
      }
    );
  }

  goCreate() {
    this.router.navigate(["create"]);
  }

  async confirmDelete(idActividad: number, nombreActividad: string) {
    const alert = await this.alertController.create({
      header: "Confirmar",
      message: "Está seguro de eliminar la actividad " + nombreActividad,
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          handler: () => {}
        },
        {
          text: "Aceptar",
          role: "OK",
          handler: async () => {
            this.loading = await this.message.presentLoading("Eliminando");
            this.loading.present();
            this.apiRest.deleteActivity(idActividad, this.token).subscribe(
              (res: any) => {
                this.message.presentToast("Actividad eliminada");
                this.getList();
              },
              error => {
                this.closeLoading();
                this.message.presentToast("Error al eliminar");
              }
            );
          }
        }
      ]
    });
    await alert.present();
  }

  edit(idActividad: number) {
    this.router.navigate(["edit/" + idActividad]);
  }

  private stopRefresh(event) {
    if (event) {
      event.target.complete();
    }
  }

  private closeLoading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }
}
