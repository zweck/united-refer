import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { GlobalStorage } from '../../services/globalstorage/globalstorage';
import { Api } from '../../services/api/api';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-paypal-settings',
  templateUrl: 'paypalSettings.html'
})
export class PaypalSettingsPage {
  onlyNumbersRegEx = /^[0-9]+$/;
  form: any;
  submited = false;
  connection: {};

  user = {
    bank_id: '',
    bank_account_id: ''
  };

  constructor(
    public navCtrl: NavController,
    public storage: GlobalStorage,
    private http: Http,
    public loadingCtrl: LoadingController,
    public api: Api,
    public alertCtrl: AlertController,
  ) {
    this.connection = storage.connection;
  }

  ionViewDidLoad(){
    // this.user = JSON.parse(localStorage.getItem('User'));
  }

  ionViewDidEnter(){
    let loader = this.loadingCtrl.create();
    loader.present();

    this.http.get(
      `${this.storage.baseUrl}/getBankAccount?${ this.storage.getAuthHelper() }`
    )
      .map((res:Response) => res.json())
      .subscribe(
        response => {
          loader.dismiss();
          this.user = {
            bank_id: response['response']['bankId'],
            bank_account_id: response['response']['bankAccountId'],
          }
        },
        error => {
          loader.dismiss();
          const alert = this.alertCtrl.create({
            title: 'Error connecting to our server',
            subTitle: 'We seem to be having some difficulties contacting our servers at this moment. Please wait a few minutes.',
            buttons: ['Ok']
          });
          alert.present();
        }
      );
  }

  submit(form) {
    this.submited = true;
    if (form.valid) {

      let headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      });

      let options = new RequestOptions({ headers: headers });

      let loader = this.loadingCtrl.create();
      loader.present();

      this.http.post(
        `${this.storage.baseUrl}/setBankAccount?${ this.storage.getAuthHelper() }`,
        `bank_id=${ encodeURIComponent(this.user.bank_id) }&bank_account_id=${ encodeURIComponent(this.user.bank_account_id) }`,
        options
      )
        .map((res:Response) => res.json())
        .subscribe(
          response => {
            loader.dismiss();
            if (response['error']['code'] != 0) {
              const alert = this.alertCtrl.create({
                title: 'Error when updating profile',
                subTitle: response['response'],
                buttons: ['Ok']
              });
              alert.present();
            } else {
              const alert = this.alertCtrl.create({
                title: 'Settings Updated',
                subTitle: 'You have successfully updated your settings.',
                buttons: ['Ok']
              });
              alert.present();
            }
          },
          error => {
            loader.dismiss();
            const alert = this.alertCtrl.create({
              title: 'Error connecting to our server',
              subTitle: 'We seem to be having some difficulties contacting our servers at this moment. Please wait a few minutes.',
              buttons: ['Ok']
            });
            alert.present();
          }
        );
    }
  }

}
