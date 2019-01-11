import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { GlobalStorage } from '../../services/globalstorage/globalstorage';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { DashboardPage } from './../dashboard/dashboard';
import { ReferralsPage } from './../referrals/referrals';

@Component({
  selector: 'page-withdraw-thanks',
  templateUrl: 'withdrawThanks.html'
})
export class WithdrawThanksPage {

  constructor(
    public navCtrl: NavController
  ) {

  }

  goToReferralsPage(){
    this.navCtrl.setRoot(DashboardPage)
    this.navCtrl.push(ReferralsPage)
  }

  goToDashboard(){
    this.navCtrl.setRoot(DashboardPage)
  }
}
