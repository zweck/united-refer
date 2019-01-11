import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { DashboardPage } from './../dashboard/dashboard';
import { GlobalStorage } from '../../services/globalstorage/globalstorage';
import { Api } from '../../services/api/api';

@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html'
})
export class TermsPage {

  dashboardPage = DashboardPage;
  tos = '';

  constructor(
    public navCtrl: NavController,
    public storage: GlobalStorage,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public api: Api,
  ) {

  }

  ionViewDidLoad(){
    let loader = this.loadingCtrl.create();
    loader.present();

    this.api.getTOS()
      .then(response => {
        loader.dismiss();

        if (response['error']['code'] != 0) {
          const alert = this.alertCtrl.create({
            title: '',
            subTitle: response['error']['message'],
            buttons: ['Ok']
          });
          alert.present();
        }else{
          this.tos = response['response'];
        }
      },
      () => {
        loader.dismiss();
      });
  }
}
