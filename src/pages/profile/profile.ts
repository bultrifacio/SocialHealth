import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { ChartsModule } from 'ng2-charts';
import { Chart } from 'angular-highcharts';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  measurements: FirebaseObjectObservable<any>;
  friendRef : string = "";
  userFriends : any;
  friends : any;
  timestamps : any;
  samples : any[];
  currentUser: firebase.User;
  dailyItems: FirebaseListObservable<any[]>;
  lastGlucoseItems: FirebaseListObservable<any[]>;
  lastHeartRateItems: FirebaseListObservable<any[]>;
  icons: string[];
  units: string[];
  date: Date;
  today: string = "";
  //Chart
  lineChartLegend:boolean = false;
  lineChartType:string = 'bar';
  lineChartData = [{data : [65, 59, 80, 81, 56, 55, 40]}];
  pepe : any = [65, 59, 80, 81, 56, 55, 40];
  lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  lineChartOptions:any = {
    responsive: true
  };
  lineChartColors:Array<any> = [
    { 
      backgroundColor: 'rgba(248,177,54,0.8)',
      borderColor: 'rgba(248,177,54,0.8)',
      pointBackgroundColor: 'rgba(248,177,54,0.8)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(248,177,54,0.8)'
    }
  ];

  chart : any;
  //end-Chart
  constructor(public navCtrl: NavController,public af: AngularFireDatabase, public navParams: NavParams,private _auth: AuthService) {
    this.measurements = this.af.object('/users/'+this.user.nick+'/');
    this.userFriends = this.af.list('/friendList/'+this.user.nick+'/');
    af.list('/friendList/'+this.user.nick, { preserveSnapshot: true }).subscribe(_friends => {
      this.friends = [];
      _friends.forEach(_friend => {
        _friend.forEach(_data => {
          this.friends.push(_data.val());
        });
      });
    });
    this.icons = ['flame','map','walk','moon'];
    this.units = ['kcal','km','','h']
    this.date = new Date(Date.now());
    this.today = this.date.getDate().toString();
    this.today +="-"+ (this.date.getMonth()+1).toString();
    this.today +="-"+ this.date.getFullYear().toString();
    //this.dailyItems = af.database.list('/daily/'+this.today+'/'+this._auth.displayNick());
    this.dailyItems = af.list('/daily/28-04-2017/'+this.user.nick);
    this.lastGlucoseItems = af.list('/glucose/'+this.user.nick, {
      query: {
        limitToFirst : 3,
        orderByKey: true
      }
    });
    this.lastHeartRateItems = af.list('/heart-rate/'+this.user.nick, {
      query: {
        limitToFirst : 3,
        orderByKey: true
      }
    });

/*
    af.list('/glucose/'+this.user.nick, { preserveSnapshot: true }).subscribe(_time => {
      this.timestamps = [];
      this.samples = [];
      _time.forEach(_sample => {      
        _sample.forEach(_data => {
          console.log("key",_data.key,"val", _data.val());
          this.timestamps.push(String(_data.key));
          this.samples.push(Number(_data.val()));
        });
        this.lineChartData = [{data : this.samples}];
        console.log("tu puta madre");
        this.chart = new Chart({
        chart: {
          type: 'column'
        },
        title: {
          text: 'Linechart'
        },
        credits: {
          enabled: false
        },
        series: [{
          name: 'Line 1',
          data: this.samples
        }]
        });
        this.samples = [];
      });

    });*/

    console.log("sgdsdfgsgsdfg",this._auth.displayNick());
    console.log(this._auth.displayEmail());
    af.list('/heart-rate/' + this._auth.displayNick() + '/', { preserveSnapshot: true }).subscribe(_time => {
      this.timestamps = [];
      this.samples = [];
      _time.forEach(_sample => {      
        _sample.forEach(_data => {
          console.log("key",_data.key,"val", _data.val());
          

        });
      });
    });
  }

  get user() {
    return { 
      name: 'this._auth.displayName()',
      email: this._auth.displayEmail(),
      nick: this._auth.displayNick(),
      photo: 'this._auth.displayPhoto()'
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Profile');


  }
  isAuthenticated(): boolean {
    return this._auth.authenticated;
  }
  signIn(): void {
    this._auth.signInWithGoogle()
      .then(() => this.onSignInSuccess());
  }

  private onSignInSuccess(): void {
    console.log("Google display name ",this._auth.displayName());
    this.measurements = this.af.object('/users/'+this.user.nick+'/');
    this.userFriends = this.af.list('/friendList/'+this.user.nick+'/');
    this.af.list('/friendList/'+this.user.nick, { preserveSnapshot: true }).subscribe(_friends => {
      this.friends = [];
      _friends.forEach(_friend => {
        _friend.forEach(_data => {
          this.friends.push(_data.val());
        });
      });
    });
  }
  signOut(): void{
    this._auth.signOut();
  }
  unFollow(friend){
    this.af.list('/friendList/'+this.user.nick, { preserveSnapshot: true }).subscribe(_friends => {
      _friends.forEach(_friend => {
        _friend.forEach(_data => {
          if (_data.val()==friend) {
            this.friendRef = _friend.key;
          }
        });
      });
    });
    this.userFriends.remove(this.friendRef);
  }
}
