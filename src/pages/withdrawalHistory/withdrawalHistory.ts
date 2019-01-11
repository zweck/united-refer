import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { GlobalStorage } from '../../services/globalstorage/globalstorage';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { WithdrawalHistoryFiltersPage } from './../withdrawalHistoryFilters/withdrawalHistoryFilters';
import * as moment from 'moment';

@Component({
  selector: 'page-withdrawal-history',
  templateUrl: 'withdrawalHistory.html'
})
export class WithdrawalHistoryPage {

  current_user: any = {};
  connection: any;
  filtersPage = WithdrawalHistoryFiltersPage;
  earnings = [];
  moment = moment;

  date_range_id = 0;

  constructor(
    public navCtrl: NavController,
    public storage: GlobalStorage,
    private http: Http,
    public loadingCtrl: LoadingController,
    public navParams: NavParams
  ) {
    this.current_user = JSON.parse(localStorage.getItem('User'));
    this.connection = this.storage.connection;
  }

  ionViewDidEnter(){

    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let options = new RequestOptions({ headers: headers });

    let loader = this.loadingCtrl.create();
    loader.present();

    this.http.post(
      `${this.storage.baseUrl}/getWithdrawalHistory?${ this.storage.getAuthHelper() }`,
      `date_range=${ this.date_range_id }&user_id=${ this.current_user.id }`,
      options
    )
      .map((res:Response) => res.json())
      .subscribe(
        response => {
          this.earnings = response['response'];
          this.calculateCount();
        },
        error => {

        },
        () => {
          loader.dismiss();
        }
      );
  }

  calculateCount(){
    // this.earningsCount = this.earnings.filter(i => i['LeadStatus']['id'] == this.status || this.status == 0).length
  }

  openFilters(){
    this.navCtrl.push(WithdrawalHistoryFiltersPage, {
      date_range_id: this.date_range_id,
      onChange: (date_range_id) => {this.date_range_id = date_range_id}
    });
  }
}
