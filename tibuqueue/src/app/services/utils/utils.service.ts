import {
  Injectable
} from '@angular/core';
import {
  AlertController,
  ToastController
} from '@ionic/angular';
import { AlertButton } from '@ionic/core';
@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private alrtCtrl: AlertController, private toastCtrl: ToastController) {}

  //Este servicio se encarga de crear un alert para la app
  async presentAlert(header: string,
    message: string,
    buttons: AlertButton[],
    subHeader ? : string,
    inputs ? : [{}],backdrop ? : boolean) {

    let alrt = await this.alrtCtrl.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: buttons,
      inputs: inputs,
      backdropDismiss:backdrop
    })
    await alrt.present();

  }
}