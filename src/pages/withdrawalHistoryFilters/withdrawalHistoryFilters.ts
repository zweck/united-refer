import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-withdrawal-history-filters',
  templateUrl: 'withdrawalHistoryFilters.html'
})
export class WithdrawalHistoryFiltersPage {

  date_range_id = '';
  onChange;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

  }

  ionViewDidLoad(){
    this.onChange = this.navParams.get('onChange');
    this.date_range_id = this.navParams.get('date_range_id');
  }

  submit(){
    this.onChange(this.date_range_id);
    this.navCtrl.pop();
  }
}
