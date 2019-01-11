import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-lead-history-filters',
  templateUrl: 'leadHistoryFilters.html'
})
export class LeadHistoryFiltersPage {

  status = 0;
  onStatusChange;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

  }

  ionViewDidLoad(){
    this.onStatusChange = this.navParams.get('onStatusChange');
    this.status = this.navParams.get('status');
  }

  submit(){
    this.onStatusChange(this.status);
    this.navCtrl.pop();
  }
}
