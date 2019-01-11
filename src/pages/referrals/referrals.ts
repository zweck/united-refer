import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { GlobalStorage } from '../../services/globalstorage/globalstorage';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { LoginPage } from './../login/login';
import { Api } from './../../services/api/api';
import * as moment from 'moment';

@Component({
  selector: 'page-referrals',
  templateUrl: 'referrals.html'
})
export class ReferralsPage {

  referrals = [];
  counter = {leads: 0, won: 0, lost: 0};
  progress = '0%';
  moment = moment;

  constructor(
    public navCtrl: NavController,
    public api: Api
  ) {

    let user = JSON.parse(localStorage.getItem('User'));

    let url = '';
    let params = {};
    if (user.vendor) {
      url = '/getLeadHistory';
      params = {};
    } else {
      url = '/getEarningsHistory';
      params = {user_id: user.id, date_range: 5};
    }

    this.progress = '0%';

    this.api.getLeadHistory(params).then( response => {
      console.log(response)

      this.progress = '30%';
      setTimeout(() => {this.progress = '100%'}, 1000);

      this.referrals = response['response'];
      this.counter = {leads: this.referrals.length, won: 0, lost: 0};

      this.referrals.forEach((val, key) => {
        if (val.LeadStatus.id == 2) {
          this.counter.won++;
        }

        if (val.LeadStatus.id == 3) {
          this.counter.lost++;
        }
      })

    })
  }
}
