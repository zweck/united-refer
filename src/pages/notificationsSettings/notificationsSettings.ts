import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { GlobalStorage } from '../../services/globalstorage/globalstorage';
import { Api } from '../../services/api/api';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-notifications-settings',
  templateUrl: 'notificationsSettings.html'
})
export class NotificationsSettingsPage {
  emailRegEx = /^.*@.*\..*$/;
  form: any;
  submited = false;
  connection: {};

  user = {
    notification_setting_id: ''
  };

  constructor(
    public navCtrl: NavController,
    public storage: GlobalStorage,
    private http: Http,
    public loadingCtrl: LoadingController,
    public api: Api,
    public alertCtrl: AlertController,
  ) {
    this.connection = storage.connection;
  }

  ionViewDidLoad(){
    this.user = JSON.parse(localStorage.getItem('User'));
  }

  submit(form) {
    this.submited = true;
    if (form.valid) {

      let headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      });

      let options = new RequestOptions({ headers: headers });

      let loader = this.loadingCtrl.create();
      loader.present();

      this.http.post(
        `${this.storage.baseUrl}/updateUser?${ this.storage.getAuthHelper() }`,
        `notification_setting_id=${ encodeURIComponent(this.user.notification_setting_id) }`,
        options
      )
        .map((res:Response) => res.json())
        .subscribe(
          response => {
            this.storage.loading = false;

            if (response.error.code != 0) {
              const alert = this.alertCtrl.create({
                title: 'Error when updating profile',
                subTitle: response.response,
                buttons: ['Ok']
              });
              alert.present();
            } else {
              localStorage.setItem('User', JSON.stringify(response['response']['User']));
            }
          },
          error => {
            this.storage.loading = false;

            const alert = this.alertCtrl.create({
              title: 'Error connecting to our server',
              subTitle: 'We seem to be having some difficulties contacting our servers at this moment. Please wait a few minutes.',
              buttons: ['Ok']
            });
            alert.present();
          },
          () => {
            this.storage.loading = false;
            loader.dismiss();
          }
        );
    }
  }

}
