import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { ForgotPasswordThanksPage } from './../forgotPasswordThanks/forgotPasswordThanks';
import { GlobalStorage } from '../../services/globalstorage/globalstorage';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgotPassword.html'
})
export class ForgotPasswordPage {

  auth: {email: string} = {email: ''};
  connection: any;
  formError: string = '';
  form: any;

  constructor(
    public navCtrl: NavController,
    public storage: GlobalStorage,
    private http: Http,
    public loadingCtrl: LoadingController,
  ) {
    this.connection = storage.connection;
  }

  ionViewDidLoad(){
    if (localStorage.getItem('User')) {
      // this.navCtrl.setRoot(DashboardPage);
    }
  }

  submit() {

    console.log('HEeeeeewwwdsfdfads=======')
    this.storage.loading = true;

    if (this.auth.email.trim() == '') {
      this.storage.loading = false;
      this.formError = 'Please complete the form';
      return;
    }

    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({ headers: headers });

    let loader = this.loadingCtrl.create({
      content: 'Connecting to the server...'
    });

    loader.present();

    this.http.post(`${this.storage.baseUrl}/forgotPassword`, `email=${ encodeURIComponent(this.auth.email) }`, options)
      .map((res:Response) => res.json())
      .subscribe(
        response => {

          console.log(response)

          this.storage.loading = false;
          loader.dismiss()

          if (response.error.code != 0) {
            this.formError = response.error.message;
          } else {
            this.navCtrl.push(ForgotPasswordThanksPage);
          }
        },
        error => {
          this.storage.loading = false;
          loader.dismiss()
          this.formError = 'There was a problem resetting your password.';
        }
      );
  }

  goBack() {
    this.navCtrl.pop();
  }
}
