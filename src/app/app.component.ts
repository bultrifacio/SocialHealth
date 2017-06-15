import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ChallengesPage } from '../pages/challenges/challenges';
import { ProfilePage } from '../pages/profile/profile';
import { LoginPage } from '../pages/login/login';
import { FriendsPage } from '../pages/friends/friends';
import { HistoricalPage } from '../pages/historical/historical';
import { FriendsSearchPage } from '../pages/friends-search/friends-search';
import { AuthService } from '../providers/auth-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string,icon: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,private _auth: AuthService) {
    this.initializeApp();
    if (this._auth.authenticated) {
      this.rootPage = ProfilePage;
    }
    this.pages = [
      { title: 'Inicio',icon: 'home', component: ProfilePage },
      { title: 'Amigos',icon: 'contacts', component: FriendsPage },
      { title: 'Búsqueda de amigos',icon: 'search', component: FriendsSearchPage },
      { title: 'Retos',icon: 'medal', component: ChallengesPage },
      { title: 'Histórico',icon: 'calendar', component: HistoricalPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
