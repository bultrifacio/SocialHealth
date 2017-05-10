import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AuthService } from '../../providers/auth-service';
import { ProfilePage } from '../profile/profile';

@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {
  friendsData : {items: FirebaseListObservable<any>, name: string}[];
  icons: string[];
  units: string[];
  date: Date;
  today: string = "";
  constructor(public navCtrl: NavController, public af: AngularFireDatabase, public navParams: NavParams,private _auth: AuthService) {
    this.icons = ['flame','map','walk','moon'];
    this.units = ['kcal','km','','h']
    this.date = new Date(Date.now());
    this.today = this.date.getDate().toString();
    this.today +="-"+ (this.date.getMonth()+1).toString();
    this.today +="-"+ this.date.getFullYear().toString();
    af.list('/friendList/'+this._auth.displayNick(), { preserveSnapshot: true }).subscribe(_friends => {
      this.friendsData = [];
      _friends.forEach(_friend => {
        _friend.forEach(_data => {
          this.friendsData.push({
          //items: af.list('/daily/+this.today+'/'+_friend.key),
          items: af.list('/daily/28-04-2017/'+_data.val(), {
            query: {
              limitToFirst : 3,
              orderByKey : true
            }
          }),
          name : _data.val()
        });
      });
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Friends');
  }
}
