import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { ForgotPasswordPage } from './../forgotPassword/forgotPassword';
import { TourPage } from './../tour/tour';
import { DashboardPage } from './../dashboard/dashboard';
import { GlobalStorage } from '../../services/globalstorage/globalstorage';
import { Api } from '../../services/api/api';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { TermsPage } from './../terms/terms';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  onlyLettersRegEx = /^[a-zA-Z ]+$/;
  phoneRegEx = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
  passwordsMatchingPattern = /^{this.user.password}/
  emailRegEx = /^.*@.*\..*$/;
  form: any;
  submited = false;
  termsPage = TermsPage;

  user = {
    first_name: '',
    surname: '',
    email: '',
    mobile: '',
    company: '',
    club_code: '',
    password: '',
    conf_password: ''
  };

  constructor(
    public navCtrl: NavController,
    public storage: GlobalStorage,
    private http: Http,
    public loadingCtrl: LoadingController,
    public api: Api,
    public alertCtrl: AlertController,
  ) {

  }

  ionViewDidLoad(){
    if (localStorage.getItem('User')) {
      this.navCtrl.setRoot(DashboardPage);
    }
  }

  submit(form) {
    this.submited = true;
    if (form.valid && this.user.password == this.user.conf_password) {
      this.storage.loading = true;

      let headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      });

      let options = new RequestOptions({ headers: headers });

      let loader = this.loadingCtrl.create({
        content: 'Connecting to the server...'
      });

      loader.present();

      this.http.post(
        `${this.storage.baseUrl}/register`,
        `first_name=${ encodeURIComponent(this.user.first_name) }&last_name=${ encodeURIComponent(this.user.surname) }&email_address=${ encodeURIComponent(this.user.email) }&mobile=${ encodeURIComponent(this.user.mobile) }&company=${ encodeURIComponent(this.user.company) }&password=${ encodeURIComponent(this.user.password) }&club_code=${ encodeURIComponent(this.user.club_code) }`,
        options
      )
        .map((res:Response) => res.json())
        .subscribe(
          response => {
            this.storage.loading = false;

            if (response.error.code != 0) {
              const alert = this.alertCtrl.create({
                title: 'Error when registering you',
                subTitle: response.response,
                buttons: ['Ok']
              });
              alert.present();
            } else {
              //if we have a user etc., put in da session, and then move to the avatar creation screen
              localStorage.setItem('User', JSON.stringify(response.response.User));
              localStorage.setItem('public_key', response.response.public_auth_key);
              localStorage.setItem('private_key', response.response.private_auth_key);

              this.storage.user = response.response.User;

              this.navCtrl.setRoot(TourPage);
            }
          },
          error => {
            this.storage.loading = false;

            const alert = this.alertCtrl.create({
              title: 'Error connecting to our server',
              subTitle: 'We seem to be having some difficulties contacting our servers at this moment. Please wait a few minutes.',
              buttons: ['Ok']
            });
            alert.present();
          },
          () => {
            this.storage.loading = false;
            loader.dismiss();
          }
        );
    }
  }

  goBack() {
    this.navCtrl.pop();
  }
}
