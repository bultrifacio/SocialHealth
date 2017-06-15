import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {
  private currentUser: firebase.User;
  private name="";
  private photo="";
  private email="";
  private nick="";
  constructor(public afAuth: AngularFireAuth) {
    afAuth.authState.subscribe((user: firebase.User) => {
      this.currentUser = user;
      if (this.currentUser!=null) {
        this.name = this.currentUser.providerData[0].displayName;
        this.email = this.currentUser.providerData[0].email;
        this.photo = this.currentUser.providerData[0].photoURL;
        this.nick = this.currentUser.providerData[0].email.slice(0,this.currentUser.providerData[0].email.indexOf("@"));
      }
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
      return this.currentUser.providerData[0].email;
    } else {
      return "nullemail";
    }
  }
  displayNick(): string {
    if(this.currentUser != null) {
      return this.currentUser.providerData[0].email.slice(0,this.currentUser.providerData[0].email.indexOf("@"));
    } else {
      return "nullnick";
    }
  }

  displayPhoto(): string {
    if (this.currentUser !== null) {
      return this.photo;
    } else {
      return 'nullphoto';
    }
  }

  displayName(): string {
    if (this.currentUser !== null) {
      return this.name;
    } else {
      return 'nullname';
    }
  }
}
