import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';
import { HttpModule } from '@angular/http';
import {SafeHtmlPipe} from "../pipes/safehtml";

import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

import { MyApp }                           from './app.component';
import { LoginPage }                       from '../pages/login/login';
import { TourPage }                        from '../pages/tour/tour';
import { SignupPage }                      from '../pages/signup/signup';
import { ForgotPasswordPage }              from '../pages/forgotPassword/forgotPassword';
import { ForgotPasswordThanksPage }        from '../pages/forgotPasswordThanks/forgotPasswordThanks';
import { DashboardPage }                   from '../pages/dashboard/dashboard';
import { SettingsPage }                    from '../pages/settings/settings';
import { PaypalSettingsPage }              from '../pages/paypalSettings/paypalSettings';
import { FAQPage }                         from '../pages/FAQ/FAQ';
import { TermsPage }                       from '../pages/terms/terms';
import { ProfilePage }                     from '../pages/profile/profile';
import { NotificationsSettingsPage }       from '../pages/notificationsSettings/notificationsSettings';
import { LeadHistoryPage }                 from '../pages/leadHistory/leadHistory';
import { LeadHistoryFiltersPage }          from '../pages/leadHistoryFilters/leadHistoryFilters';
import { WithdrawalHistoryPage }           from '../pages/withdrawalHistory/withdrawalHistory';
import { WithdrawalHistoryFiltersPage }    from '../pages/withdrawalHistoryFilters/withdrawalHistoryFilters';
import { ServiceCategoriesPage }           from '../pages/serviceCategories/serviceCategories';
import { ReferralDetailsPage }             from '../pages/referralDetails/referralDetails';
import { ReferralsPage }                   from '../pages/referrals/referrals';
import { LeadThanksPage }                  from '../pages/leadThanks/leadThanks';
import { WithdrawPage }                    from '../pages/withdraw/withdraw';
import { WithdrawThanksPage }              from '../pages/withdrawThanks/withdrawThanks';

import { GlobalStorage }                   from '../services/globalstorage/globalstorage';
import { Api }                             from '../services/api/api';
import { Cache }                           from '../services/cache/cache';

let imports = [
  MyApp,
  LoginPage,
  ForgotPasswordPage,
  ForgotPasswordThanksPage,
  SignupPage,
  DashboardPage,
  SettingsPage,
  TourPage,
  FAQPage,
  TermsPage,
  ProfilePage,
  PaypalSettingsPage,
  NotificationsSettingsPage,
  LeadHistoryPage,
  LeadHistoryFiltersPage,
  WithdrawalHistoryPage,
  WithdrawalHistoryFiltersPage,
  ServiceCategoriesPage,
  ReferralDetailsPage,
  ReferralsPage,
  LeadThanksPage,
  WithdrawPage,
  WithdrawThanksPage
];

@NgModule({
  declarations: [
    ...imports,
    SafeHtmlPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      backButtonIcon: 'ios-arrow-back',
      iconMode: 'sm'
    }),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: imports,
  providers: [
    StatusBar,
    Keyboard,
    SplashScreen,
    GlobalStorage,
    Api,
    Cache,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    File,
    Transfer,
    Camera,
    FilePath,
  ]
})
export class AppModule {}
