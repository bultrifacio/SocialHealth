import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AuthService } from '../../providers/auth-service';
import { ProfilePage } from '../profile/profile';

@Component({
  selector: 'page-friends-search',
  templateUrl: 'friends-search.html',
})
export class FriendsSearchPage {
  usersList : any;
  loaddedUsersList : any;
  queryText : string = '';
  userFriendsRef : any;
  friendRef : any;
  userFriends : any;
  containsFriend : any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public af: AngularFireDatabase,private _auth: AuthService) {
    this.userFriendsRef = this.af.list('/friendList/'+this._auth.displayNick()+'/');
    af.list('/friendList/'+this._auth.displayNick(), { preserveSnapshot: true }).subscribe(_friends => {
      this.userFriends = [];      
      _friends.forEach(_friend => {
        _friend.forEach(_data => {
          this.userFriends.push(_data.val());
        });
      });
    });
    af.list('/users/', { preserveSnapshot: true }).subscribe(_users => {
      let users = [];
      _users.forEach(_user => {
        this.containsFriend = this.userFriends.indexOf(_user.key);
        if (_user.key!=this._auth.displayNick() && this.containsFriend==-1) {
          users.push(_user.key);          
        }
      });
      this.usersList = users;
      this.loaddedUsersList = users;
    });
  }
  initializeItems(): void {
    this.usersList = this.loaddedUsersList;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendsSearch');
  }
  getItems(ev: any) {
    this.initializeItems();
    let val = ev.target.value;

    if (val && val.trim() != '') {
        this.usersList = this.usersList.filter((item) => {
          return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
    }
  }
  follow(friend){
    this.userFriendsRef.push({ user: friend});
    this.af.list('/friendList/'+this._auth.displayNick(), { preserveSnapshot: true }).subscribe(_friends => {
      this.userFriends = [];      
      _friends.forEach(_friend => {
        _friend.forEach(_data => {
          this.userFriends.push(_data.val());
        });
      });
    });
    this.af.list('/users/', { preserveSnapshot: true }).subscribe(_users => {
      let users = [];
      _users.forEach(_user => {
        this.containsFriend = this.userFriends.indexOf(_user.key);
        if (_user.key!=this._auth.displayNick() && this.containsFriend==-1) {
          users.push(_user.key);          
        }
      });
      this.usersList = users;
      this.loaddedUsersList = users;
    });
  }
}
