import axios from 'axios';
import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { GlobalStorage } from '../../services/globalstorage/globalstorage';
import { Api } from '../../services/api/api';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { ActionSheetController } from 'ionic-angular'
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  onlyLettersRegEx = /^[a-zA-Z ]+$/;
  phoneRegEx = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
  passwordsMatchingPattern = /^{this.user.password}/
  emailRegEx = /^.*@.*\..*$/;
  form: any;
  submited = false;
  connection: {};
  lastImage;

  user = {
    first_name: '',
    last_name: '',
    email_address: '',
    mobile: '',
    company: '',
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
    profile_photo: ''
  };

  constructor(
    public navCtrl: NavController,
    public storage: GlobalStorage,
    private http: Http,
    public loadingCtrl: LoadingController,
    public api: Api,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    private transfer: Transfer,
    private file: File,
    private filePath: FilePath,
    private platform: Platform,
    public toastCtrl: ToastController
  ) {
    this.connection = storage.connection;
  }

  ionViewDidLoad(){
    this.user = JSON.parse(localStorage.getItem('User'));
  }

  submit(form) {
    this.submited = true;
    if (form.valid) {
      this.storage.loading = true;

      let headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      });

      let options = new RequestOptions({ headers: headers });

      let loader = this.loadingCtrl.create({
        content: 'Connecting to the server...'
      });

      loader.present();

      this.http.post(
        `${this.storage.baseUrl}/updateUser?${ this.storage.getAuthHelper() }`,
        Object['entries']({
          first_name: this.user.first_name,
          last_name: this.user.last_name,
          email_address: this.user.email_address,
          mobile: this.user.mobile,
          company: this.user.company,
          current_password: this.user.current_password || '',
          new_password: this.user.new_password || '',
          new_password_confirmation: this.user.new_password_confirmation || ''
        }).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')
        ,
        options
      )
        .map((res:Response) => res.json())
        .subscribe(
          response => {
            this.storage.loading = false;

            if (response.error.code != 0) {
              const alert = this.alertCtrl.create({
                title: response['error']['message'],
                subTitle: response.response,
                buttons: ['Ok']
              });
              alert.present();
            } else {

              localStorage.setItem('User', JSON.stringify(this.user));

              const alert = this.alertCtrl.create({
                title: 'Settings Updated',
                subTitle: 'You have successfully updated your settings.',
                buttons: ['Ok']
              });
              alert.present();
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

  public uploadImage(e) {
    const file = e.target.files[0];
    if (!file) return false;
    const loading = this.loadingCtrl.create({
        content: 'Uploading...',
    });
    loading.present();
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => {
        // Destination URL
        const data = new FormData();
        data.set('file', file, file.name);
        axios.post(
          `${this.storage.baseUrl}/uploadAvatar?${ this.storage.getAuthHelper() }`,
          data
        ).then(res => {
            this.user.profile_photo = res.data.response.avatar;
            localStorage.setItem('User', JSON.stringify(this.user));
            loading.dismissAll();
        });
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
        loading.dismissAll();
        alert('Error while uploading file.');
    };
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName =  n + ".jpg";
    return newFileName;
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

// Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return window['cordova']['file']['dataDirectory'] + img;
    }
  }
}
