import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { LoginPage } from './../login/login';
import { SettingsPage } from './../settings/settings';
import { ServiceCategoriesPage } from './../serviceCategories/serviceCategories';
import { WithdrawPage } from './../withdraw/withdraw';
import { ReferralsPage } from './../referrals/referrals';
import { Api } from '../../services/api/api';
import { GlobalStorage } from '../../services/globalstorage/globalstorage';
import { Http, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { ProfilePage } from './../profile/profile';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  @ViewChild('videoPlayer') videoplayer: any;

  current_user: any = {
    profile_photo: '',
    current_balance: 0
  }

  balance = {
    winner_count: ''
  }

  connection: any = null;
  settingsPage = SettingsPage;
  serviceCategoriesPage = ServiceCategoriesPage;
  referralsPage = ReferralsPage;
  withdrawPage = WithdrawPage;
  profilePage = ProfilePage;
  videoOpened = false;
  video = '';
  video_webm = '';
  thumbnail = '';

  constructor(
    public navCtrl: NavController,
    public api: Api,
    public storage: GlobalStorage,
    public alertCtrl: AlertController,
    public http: Http
  ) {
    this.connection = storage.connection;
  }

  ionViewDidLoad(){
    this.current_user = localStorage.getItem('User');

    if (!this.current_user) {
      this.navCtrl.setRoot(LoginPage);
    }

    this.balance = JSON.parse(localStorage.getItem('Balance')) || {};

    this.api.getUser()
      .then(res => {
          localStorage.setItem('User', JSON.stringify(res['response']));

          this.current_user = res['response'];

          if (res['error']['code'] != 0) {
            const alert = this.alertCtrl.create({
              title: 'You\'ve been logged out!',
              subTitle:  'Your authentication token seems to have expired, please log in again.',
              buttons: ['Ok']
            });
            alert.present();

            localStorage.clear();
            delete this.storage.user;
            this.navCtrl.setRoot(LoginPage);
          }
        }
      );

    this.http.get(`${this.storage.baseUrl}/video?${ this.storage.getAuthHelper() }`)
      .map((res:Response) => res.json())
      .subscribe(
        response => {

          this.videoplayer.nativeElement.oncanplay = () => {
            this.videoplayer.nativeElement.style.opacity = 1;
          };

          this.videoplayer.nativeElement.style.opacity = 0;
          this.videoplayer.nativeElement.src = `${this.storage.primaryDomain}${response['response']}`;

          // this.video = `${this.storage.primaryDomain}${response['response']}`;
          // this.video_webm = `${this.storage.primaryDomain}${response['response'].replace(/.mp4/gi, '.webm')}`;
          // this.thumbnail = `${this.storage.primaryDomain}${response['response'].replace(/.mp4/gi, '.jpg')}`;
        },
        error => {

        }
      );

    // this.navCtrl.push(SettingsPage)
  }

  ionViewDidEnter(){
    this.current_user = JSON.parse(localStorage.getItem('User'));
  }

  playVideo(){
    this.videoOpened = true;

    this.videoplayer.nativeElement.play();
  }

  closeVideo(){
    this.videoOpened = false;
    this.videoplayer.nativeElement.pause();
  }

}
