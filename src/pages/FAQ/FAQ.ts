import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DashboardPage } from './../dashboard/dashboard';
import { GlobalStorage } from '../../services/globalstorage/globalstorage';
import { Api } from '../../services/api/api';

@Component({
  selector: 'page-faq',
  templateUrl: 'FAQ.html',
})
export class FAQPage {

  dashboardPage = DashboardPage;
  faqs = [];
  currentIndex;

  constructor(
    public navCtrl: NavController,
    public storage: GlobalStorage,
    public api: Api,
  ) {

  }

  public handleSectionClick(index){
    if(this.currentIndex == index){
      this.currentIndex = null;
    }else{
      this.currentIndex = index;
    }
  }

  ionViewDidLoad(){
    this.storage.loading = true;

    this.api.getFAQ().then((res)  => {
      this.storage.loading = false;
      this.faqs = res['response'];
    });
  }
}
