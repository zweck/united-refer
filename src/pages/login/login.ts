import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { ForgotPasswordPage } from './../forgotPassword/forgotPassword';
import { SignupPage } from './../signup/signup';
import { DashboardPage } from './../dashboard/dashboard';
import { GlobalStorage } from '../../services/globalstorage/globalstorage';
import { Api } from '../../services/api/api';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  auth: {email: string, password: string} = {email: '', password: ''};
  connection: {online: boolean, loginVars: boolean, type: string} = {
    online: true,
    loginVars: false,
    type: ""
  };
  form:any;
  formError: string = '';
  forgotPasswordPage = ForgotPasswordPage;
  signupPage = SignupPage;
  current_user: any;

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
    this.current_user = {};

    if (localStorage.getItem('User')) {
      this.navCtrl.setRoot(DashboardPage);
    }
  }

  loginUser() {
    this.storage.loading = true;
    if (this.auth.email.trim() == '' || this.auth.password.trim() == '') {
      this.storage.loading = false;
      this.formError = 'Please complete the form';
      return;
    }

    let body = JSON.stringify({
      username: this.auth.email,
      password: this.auth.password,
    });

    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({ headers: headers });

    let loader = this.loadingCtrl.create({
      content: 'Connecting to the server...'
    });

    loader.present();

    this.http.post(
      `${this.storage.baseUrl}/login`,
      `username=${ encodeURIComponent(this.auth.email) }&password=${ encodeURIComponent(this.auth.password) }`,
      options
    )
      .map((res:Response) => res.json())
      .subscribe(
        response => {
          if(response['error']['message']){
            this.formError = response['error']['message'];

            loader.dismiss();
            return;
          }
          // if we have a user etc., put in da session, and then move to the avatar creation screen
          localStorage.setItem('public_key', response['response']['public_auth_key']);
          localStorage.setItem('private_key', response['response']['private_auth_key']);
          localStorage.setItem('User', JSON.stringify(response['response']['User']));
          //if we have a vendor, then store that in the session too
          if (response.response.Vendor) {
            localStorage.setItem('Vendor', JSON.stringify(response.response.Vendor));
          }
          this.storage.user = response.response.User;

          this.api.getBalance()
            .then(response2 =>  {
                this.storage.loading = false;

                if (response2['error']['code'] != 0) {

                  const alert = this.alertCtrl.create({
                    title: 'Error getting your account balance.',
                    subTitle: response2['data']['error']['message'],
                    buttons: ['Ok']
                  });
                  alert.present();

                } else {
                  //response should contain some more information about the user
                  //lead_count, current_balance and available_balance
                  this.current_user.lead_count = response2['response']['User']['lead_count'];
                  this.current_user.winner_count = response2['response']['User']['winner_count'] > 0 ? response2['response']['User']['winner_count'] : 0;
                  this.current_user.current_balance = response2['response']['User']['current_balance'];
                  this.current_user.available_balance = response2['response']['User']['available_balance'];
                  this.current_user.total_earned = response2['response']['User']['total_earned'];

                  localStorage.setItem('Balance', JSON.stringify(this.current_user));
                  this.navCtrl.setRoot(DashboardPage);
                }
              },
              () => {
                //Load from cache if we can!
              });

          this.api.getVendors();
          this.api.getFavourites();
          this.api.getUser();
          this.api.getLeadCount();
          // this.api.getWithdraw();
          // this.api.getVendorQuestions();
          this.api.getFAQ();
          this.api.getTOS();
          if (this.storage.user.id > 0) {
            this.api.getEarningHistory(this.storage.user.id);
            this.api.getWithdrawalHistory(this.storage.user.id);
            this.api.getLeadHistory({user_id: this.storage.user.id, date_range: 5});
          }
          loader.dismiss();
        },
        error => {
          this.formError = error.message;
          loader.dismiss();
        }
      );
  }
}
