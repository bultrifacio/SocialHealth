import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { ChallengesPage } from '../pages/challenges/challenges';
import { ProfilePage } from '../pages/profile/profile';
import { FriendsPage } from '../pages/friends/friends';
import { LoginPage } from '../pages/login/login';
import { HistoricalPage } from '../pages/historical/historical';
import { FriendsSearchPage } from '../pages/friends-search/friends-search';
import { AuthService } from '../providers/auth-service';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { MyDatePickerModule } from 'mydatepicker';
import { MyDateRangePickerModule } from 'mydaterangepicker';

export const firebaseConfig = {
  apiKey: 'AIzaSyA3ddRM8bJZZf_2AC8tBfWDFtIzmuUWfq4',
  authDomain: 'socialhealth-6ce5a.firebaseapp.com',
  databaseURL: 'https://socialhealth-6ce5a.firebaseio.com',
  storageBucket: 'socialhealth-6ce5a.appspot.com',
  messagingSenderId: '340848211714'
};
@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    ChallengesPage,
    FriendsPage,
    FriendsSearchPage,
    HistoricalPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ChartsModule,
    RoundProgressModule,
    AngularFireAuthModule,
    MyDateRangePickerModule,
    MyDatePickerModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilePage,
    ChallengesPage,
    FriendsPage,
    FriendsSearchPage,
    HistoricalPage,
    LoginPage
  ],
  providers: [
    AuthService,
    SplashScreen,
    StatusBar,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
