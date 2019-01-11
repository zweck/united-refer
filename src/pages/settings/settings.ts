import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { GlobalStorage } from '../../services/globalstorage/globalstorage';
import { Api } from '../../services/api/api';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { TourPage }                  from './../tour/tour';
import { LoginPage }                 from './../login/login';
import { FAQPage }                   from './../FAQ/FAQ';
import { TermsPage }                 from './../terms/terms';
import { ProfilePage }               from './../profile/profile';
import { PaypalSettingsPage }        from './../paypalSettings/paypalSettings';
import { NotificationsSettingsPage } from './../notificationsSettings/notificationsSettings';
import { LeadHistoryPage }           from './../leadHistory/leadHistory';
import { WithdrawalHistoryPage }     from './../withdrawalHistory/withdrawalHistory';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  current_user: any = {};
  connection: any;
  tourPage = TourPage;
  faqPage = FAQPage;
  termsPage = TermsPage;
  profilePage = ProfilePage;
  paypalSettingsPage = PaypalSettingsPage;
  notificationsSettingsPage = NotificationsSettingsPage;
  leadHistoryPage = LeadHistoryPage;
  withdrawalHistoryPage = WithdrawalHistoryPage;

  constructor(
    public navCtrl: NavController,
    public storage: GlobalStorage,
    private http: Http,
    public loadingCtrl: LoadingController,
    public api: Api,
    public alertCtrl: AlertController,
  ) {
    this.connection = this.storage.connection;
  }

  ionViewDidLoad(){
    this.current_user = JSON.parse(localStorage.getItem('User'));
    // this.navCtrl.push(WithdrawalHistoryPage)
  }

  ionViewDidEnter(){
    this.current_user = JSON.parse(localStorage.getItem('User'));
  }

  logout() {
    localStorage.clear();

    delete this.storage.user;
    this.http.get(`${this.storage.baseUrl}/logout?${ this.storage.getAuthHelper() }`)
    this.navCtrl.setRoot(LoginPage);
  }
}
