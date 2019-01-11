import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { GlobalStorage } from '../../services/globalstorage/globalstorage';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Api } from '../../services/api/api';

import { WithdrawThanksPage } from './../withdrawThanks/withdrawThanks';
import { PaypalSettingsPage } from './../paypalSettings/paypalSettings';

@Component({
  selector: 'page-withdraw',
  templateUrl: 'withdraw.html'
})
export class WithdrawPage {

  user = {
    id: null,
    available_balance: 0,
    total_earned: null,
    current_balance: null,
    winner_count: null,
    lead_count: null,
    vendor: null
  };
  lead_count = 0;
  new_count = 0;
  active_count = 0;
  JSON = JSON;
  withdrawal_methods;
  withdraw;
  paypalSettingsPage = PaypalSettingsPage;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public api: Api,
    public loadingCtrl: LoadingController,
    public storage: GlobalStorage,
    public http: Http
  ) {

  }

  ionViewDidLoad(){
    this.user = JSON.parse(localStorage.getItem('User'));

    let loader = this.loadingCtrl.create();
    loader.present();

    if (this.user.vendor) {

      this.api.getLeadCount()
        .then(response => {
          if (response['error']['code'] != 0) {
            const alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: response['error']['message'],
              buttons: ['Ok']
            });
            alert.present();
          } else {
            this.lead_count = response['response']['month_count'];
            this.new_count = response['response']['new_count'];
            this.active_count = response['response']['active_count'];
          }
          loader.dismiss()
        },
        () => {
            //ToDo: Load From cache
          loader.dismiss()
        }
      );
    } else {
      this.api.getBalance()
        .then(response => {
          if (response['error']['code'] != 0) {
            const alert = this.alertCtrl.create({
              title: 'Error getting your account balance.',
              subTitle: response['data']['error']['message'],
              buttons: ['Ok']
            });
            alert.present();
          } else {
            this.user.lead_count = response['response']['User']['lead_count'];
            this.user.winner_count = response['response']['User']['winner_count']> 0 ? response['response']['User']['winner_count'] : 0;
            this.user.current_balance = response['response']['User']['current_balance'];
            this.user.available_balance = response['response']['User']['available_balance'];
            this.user.total_earned = response['response']['User']['total_earned'];

            localStorage.setItem('Balance', JSON.stringify(this.user));
          }
          loader.dismiss()
        },
        () => {
            //ToDo: Load from cache
          loader.dismiss()
        }
      );
    }

    this.withdraw = {user_id: this.user.id, amount: this.user.available_balance};

    this.api.getWithdraw().then(response => {
      this.withdrawal_methods = response;
    });
  }

  withdrawRequest(){
    let loader = this.loadingCtrl.create();
    loader.present();

    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({ headers: headers });

    this.http.get(`${this.storage.baseUrl}/withdrawRequest?${ this.storage.getAuthHelper() }`, options)
      .map((res:Response) => res.json())
      .subscribe(
        response => {
          if (response['error']['code'] != 0) {
            const alert = this.alertCtrl.create({
              title: 'Error submitting your request to withdraw.',
              subTitle: response['error']['message'],
              buttons: ['Ok']
            });
            alert.present();
          } else {
            this.user.lead_count = response['response']['User']['lead_count'];
            this.user.winner_count = response['response']['User']['winner_count'];
            this.user.current_balance = response['response']['User']['current_balance'];
            this.user.available_balance = response['response']['User']['available_balance'];
            localStorage.setItem('User', JSON.stringify(this.user));

            this.navCtrl.push(WithdrawThanksPage);
          }
        },
        error => {
          const alert = this.alertCtrl.create({
            title: 'Error submitting your request to withdraw!',
            subTitle: 'We\'re not too sure what happened! Is your network down? Please try again.',
            buttons: ['Ok']
          });
          alert.present();
        },
        () => {
          loader.dismiss();
        }
      );
  };
}
