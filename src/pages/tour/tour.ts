import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DashboardPage } from './../dashboard/dashboard';
import { GlobalStorage } from '../../services/globalstorage/globalstorage';

@Component({
  selector: 'page-tour',
  templateUrl: 'tour.html',
})
export class TourPage {

  dashboardPage = DashboardPage;

  constructor(
    public navCtrl: NavController,
  ) {

  }
}
