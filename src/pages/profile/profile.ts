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

  public showImageSourceSelection() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [{
        text: 'Load from gallery',
        handler: () => {this.loadImage(this.camera.PictureSourceType.PHOTOLIBRARY);}
      },{
        text: 'Take a photo',
        handler: () => {this.loadImage(this.camera.PictureSourceType.CAMERA);}
      },{
        text: 'Cancel',
        role: 'cancel'
      }]
    });
    actionSheet.present();
  }

  private loadImage(sourceType:number){
    var options = {
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      targetWidth: 300,
      targetHeight: 300
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  public uploadImage() {
    // Destination URL
    var url = `${this.storage.baseUrl}/uploadAvatar?${ this.storage.getAuthHelper() }`;

    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);

    // File name only
    var filename = this.lastImage;

    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'fileName': filename}
    };

    const fileTransfer = this.transfer.create();

    let loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    loading.present();

    fileTransfer.upload(targetPath, url, options).then(data => {
      loading.dismissAll();
      this.user.profile_photo = JSON.parse(data['response'])['response']['avatar'];
      localStorage.setItem('User', JSON.stringify(this.user));
    }, err => {
      loading.dismissAll()
      this.presentToast('Error while uploading file.');
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName =  n + ".jpg";
    return newFileName;
  }

// Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, window['cordova']['file']['dataDirectory'], newFileName).then(success => {
      this.lastImage = newFileName;
      this.uploadImage();
    }, error => {
      this.presentToast('Error while storing file.');
    });
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
