import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoadingController } from 'ionic-angular';

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen
  ,public loadingCtrl: LoadingController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      let loader = this.loadingCtrl.create({
        content: "Sup bruh?...",
        duration: 800
      });
      loader.present();
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
