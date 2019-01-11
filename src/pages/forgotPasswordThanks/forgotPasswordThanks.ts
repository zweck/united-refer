import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { GlobalStorage } from '../../services/globalstorage/globalstorage';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { LoginPage } from './../login/login';

@Component({
  selector: 'page-forgot-password-thanks',
  templateUrl: 'forgotPasswordThanks.html'
})
export class ForgotPasswordThanksPage {

  constructor(
    public navCtrl: NavController
  ) {

  }

  goBack(){
    this.navCtrl.setRoot(LoginPage)
  }
}
