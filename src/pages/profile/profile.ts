import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { LoginPage } from '../login/login';
import * as firebase from 'firebase/app';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  isDailyDataAvailable: boolean = false;
  areFriendsAvailable: boolean = false;
  measurements: FirebaseObjectObservable<any>;
  friendRef : string = "";
  userFriends : any;
  friends : any;
  timestamps : any;
  samplesHeartRate : any[];
  samplesGlucose : any[];
  dailyItems: FirebaseListObservable<any[]>;
  icons: string[];
  units: string[];
  date: Date;
  today: string = "";
  currentUser: firebase.User;
  providerData : any;
  challenges : any;
  challengeData : any;
  challengesNames : any;
  challengesProgress: any;
  dailyData: any;
  name;
  email;
  photo;
  nick;
  itemHeartRate;
  itemGlucose;
  instants = [];
  isUserInfoAvailable: boolean = false;
  chartLegend:boolean = false;
  fields = ['Cantidad','Objetivo'];
  areChallengesAvailable: boolean = false;
  heartRateChartData;
  heartRateLabels;
  heartRateChartType:string = 'bar';
  isHeartRateAvailable: boolean = false;
  heartRateChartOptions:any = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          suggestedMin: 50
        },
        gridLines: {
          display:false
        }
      }],
      xAxes: [{
        display: false
      }]
    }
  };
  heartRateChartColors:Array<any> = [
    { 
      backgroundColor: 'rgba(248,177,54,0.8)',
      borderColor: 'rgba(248,177,54,0.8)',
      pointBackgroundColor: 'rgba(248,177,54,0.8)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(248,177,54,0.8)'
    }
  ];
  glucoseChartType:string = 'line';
  isGlucoseAvailable: boolean = false;
  glucoseChartData;
  glucoseLabels;
  glucoseChartOptions:any = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          suggestedMin: 80
        },
        gridLines: {
          display:false
        }
      }],
      xAxes: [{
        display: false
      }]
    }
  };
  glucoseChartColors:Array<any> = [
    { 
      backgroundColor: 'rgba(248,177,54,0.8)',
      borderColor: 'rgba(248,177,54,0.8)',
      pointBackgroundColor: 'rgba(248,177,54,0.8)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(248,177,54,0.8)'
    }
  ];
  constructor(public navCtrl: NavController,public af: AngularFireDatabase, public navParams: NavParams, private _auth: AuthService) {
    if(!this.isAuthenticated()){
      this.navCtrl.push(LoginPage);
    }
    this.photo = this._auth.displayPhoto();
    this.name = this._auth.displayName();
    this.nick = this._auth.displayNick();
    this.email = this._auth.displayEmail();
    this.isUserInfoAvailable = false;
    this.isDailyDataAvailable = false;
    this.areFriendsAvailable = false;
    this.areChallengesAvailable = false;
    this.isGlucoseAvailable = false;
    this.isHeartRateAvailable = false;
    this.measurements = this.af.object('/users/'+this.nick+'/');
    this.userFriends = this.af.list('/friendList/'+this.nick+'/');
    af.list('/friendList/'+this.nick, { preserveSnapshot: true }).subscribe(_friends => {
      this.friends = [];
      this.areFriendsAvailable = false;
      _friends.forEach(_friend => {
        _friend.forEach(_data => {
          this.friends.push(_data.val());
        });
      });
      this.areFriendsAvailable = true;
    });
    this.icons = ['flame','map','walk','moon'];
    this.units = ['kcal','km','','h'];
    this.date = new Date(Date.now());
    this.today = this.date.getDate().toString();
    this.today +="-"+ (this.date.getMonth()+1).toString();
    this.today +="-"+ this.date.getFullYear().toString();
    this.getHourInstants();
    this.heartRateLabels = this.instants;
    this.glucoseLabels = this.instants;
    this.dailyItems = af.list('/daily/'+this.today+'/'+this.nick);
    af.list('/daily/'+this.today+'/'+this.nick + '/', { preserveSnapshot: true }).subscribe(_items => {
      this.dailyData= [];
      _items.forEach(_item =>{
        this.dailyData.push(_item.val());
      });
      this.isDailyDataAvailable = true;
    });
    this.samplesHeartRate = [];
    this.samplesGlucose = [];
    for (var moment of this.instants) {
      this.itemHeartRate = this.af.object('/heart-rate/' + this._auth.displayNick()
        + this.today + moment + '/',{ preserveSnapshot: true });
      this.itemHeartRate.subscribe(heartRateValue => {
        this.samplesHeartRate.push(heartRateValue.val());
        this.updateHeartRateChart(this.samplesHeartRate.length);
      });
      this.itemGlucose = this.af.object('/glucose/' +this._auth.displayNick()
        + this.today + moment + '/',{ preserveSnapshot: true });
      this.itemGlucose.subscribe(glucoseValue => {
        this.samplesGlucose.push(glucoseValue.val());
        this.updateGlucoseChart(this.samplesGlucose.length);
      });
    }
    af.list('/challenges/'+this.nick, { preserveSnapshot: true }).subscribe(_challenges => {
      this.challenges = [];
      this.challengeData = [];
      this.challengesNames = [];
      this.challengesProgress = [];
      let objective=0;
      let quantity=0;
      _challenges.forEach(_challenge => {
        _challenge.forEach(_item => {
          if (_item.key=="nombre") {
            this.challengesNames.push(_item.val());
          }else{
            if (_item.key=="objetivo") {
              switch (_item.val()) {
                case "pasos":
                  objective = this.dailyData[2];
                  break;
                case "distancia":
                  objective = this.dailyData[1];
                break;
                case "calorías":
                  objective = this.dailyData[0];
                  break;
                default:
                  console.log("Something is wrong with de objective");
                  break;
              }
            }
            if (_item.key=="cantidad") {
                quantity=_item.val();
            }
            if (_item.key!="porcentaje") {
              this.challengeData.push(_item.val());
            }
          }
      });
        if (isNaN(objective) || objective == null) {
          objective = 0;
        }
        let percentage = Math.ceil((objective*100)/quantity);
        if (percentage>100) {
          percentage=100;
        }
        af.object('/challenges/'+this.nick+'/'+_challenge.key).update({ porcentaje: percentage});
        this.challengesProgress.push(percentage);
        this.challenges.push(this.challengeData);
        this.challengeData = [];
      });
      this.areChallengesAvailable=true;
    });
    this.isUserInfoAvailable = true;
  }
  getHourInstants(): any{
    let hour = this.date.getHours();
    let minute = this.date.getMinutes();
    let initLimit = hour * 60 + minute - 60;
    let endLimit = hour * 60 + minute;
    this.instants = [];
    for (var i = initLimit; i < endLimit; i++) {
      if (minute==59) {
        hour++;
        minute = 0;
      }else{
        minute++;
      }
      this.instants.push(this.addZero(hour)+":"+this.addZero(minute));
    }
    return this.instants;
  }
  updateHeartRateChart(samplesLength): any{
      if (samplesLength==this.instants.length) {
        this.heartRateChartData = [{data : this.samplesHeartRate}];
        this.isHeartRateAvailable = true;
      }
  }
  updateGlucoseChart(samplesLength): any{
      if (samplesLength==this.instants.length) {
        this.glucoseChartData = [{data : this.samplesGlucose}];
        this.isGlucoseAvailable = true;
      }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad Profile');
  }
  addZero(number): any {
    return number<10? '0'+number:''+number;
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
    this.navCtrl.push(LoginPage);
  }
  private onSignInSuccess(): void {
    console.log(this._auth.displayName());
  }
  unFollow(friend){
    this.af.list('/friendList/'+this.nick, { preserveSnapshot: true }).subscribe(_friends => {
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
