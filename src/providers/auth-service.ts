import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {
  private authState: Observable<firebase.User>;
  private currentUser: firebase.User;
  private providerData : any;
  constructor(public afAuth: AngularFireAuth) {
    this.authState = afAuth.authState;
    this.authState.subscribe((user: firebase.User) => {
      this.currentUser = user;
      this.providerData = this.currentUser.providerData[0];
    });

  }

  get authenticated(): boolean {
    return this.currentUser !== null;
  }


  signInWithGoogle(): firebase.Promise<firebase.User>{
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }  
  signOut(): void {
    this.afAuth.auth.signOut();
  }

  displayEmail(): string {
    if(this.currentUser != null) {
      return this.currentUser.email;
    } else {
      return "nullemail";
    }
  }
  displayNick(): string {
    if(this.currentUser != null) {
      var email = this.currentUser.email;
      return email.slice(0,email.indexOf("@"));
    } else {
      return "nullnick";
    }
  }

  displayPhoto(): string {
    if (this.currentUser !== null) {
      return this.currentUser.photoURL;
    } else {
      return 'nullphoto';
    }
  }

  displayName(): string {
    if (this.currentUser !== null) {
      return this.currentUser.displayName;
    } else {
      return 'nullname';
    }
  }
}
