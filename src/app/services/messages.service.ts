import { Injectable } from "@angular/core";
import { ToastController, LoadingController } from "@ionic/angular";

@Injectable({
  providedIn: "root"
})
export class MessagesService {
  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  async presentToast(text: string, duration?: number) {
    const toast = await this.toastController.create({
      message: text,
      position: "bottom",
      duration: duration != null ? duration : 2000
    });
    toast.present();
  }

  presentLoading(text: string) {
    const loading = this.loadingController.create({
      message: text
    });
    return loading;
  }
}
