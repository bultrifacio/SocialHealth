import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { MyApp } from '../../app/app.component';
import { ProfilePage } from '../profile/profile';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController,  private _auth: AuthService, public navParams: NavParams) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }
  isAuthenticated(): boolean {
    return this._auth.authenticated;
  }
  signIn(): any {
    return this._auth.signInWithGoogle()
    .then(() => this.onSignInSuccess());
  }
  signOut(): void {
    this._auth.signOut();
  }
  private onSignInSuccess(): void {
    console.log(this._auth.displayName());
    this.navCtrl.setRoot(MyApp);
    this.navCtrl.push(MyApp);
  }
}
