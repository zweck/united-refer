import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, NavParams } from 'ionic-angular';
import { GlobalStorage } from '../../services/globalstorage/globalstorage';
import { Api } from '../../services/api/api';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { LeadHistoryFiltersPage } from './../leadHistoryFilters/leadHistoryFilters';
import * as moment from 'moment';

@Component({
  selector: 'page-lead-history',
  templateUrl: 'leadHistory.html'
})
export class LeadHistoryPage {

  current_user: any = {};
  date_range_id: any;
  connection: any;
  filtersPage = LeadHistoryFiltersPage;
  earnings = [];
  earningsCount = 0;
  moment = moment;

  status = '0';

  constructor(
    public navCtrl: NavController,
    public storage: GlobalStorage,
    private http: Http,
    public loadingCtrl: LoadingController,
    public api: Api,
    public alertCtrl: AlertController,
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
      `${this.storage.baseUrl}/getEarningsHistory?${ this.storage.getAuthHelper() }`,
      `date_range_id=${ this.status }&user_id=${ this.current_user.id }`,
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
    this.earningsCount = this.earnings.filter(i => i['LeadStatus']['id'] == this.status || this.status == '0').length
  }

  openFilters(){
    this.navCtrl.push(LeadHistoryFiltersPage, {
      status: this.status,
      onStatusChange: (status) => {this.status = status}
    });
  }
}
