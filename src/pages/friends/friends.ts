import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AuthService } from '../../providers/auth-service';

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
  challenges : any;
  challengeData : any;
  challengesNames : any;
  challengesProgress: any;
  friendsNames: any;
  /*
  allFriendsData: {items: FirebaseListObservable<any>, name: string, 
    photo: FirebaseObjectObservable<any>,challenges: any[], 
    challengesNames: String[], challengesProgress: any[]}[];*/
    allFriendsData;
  //chart
  chartLegend:boolean = false;
  //challenges
  fields = ['Cantidad','Objetivo'];
  isFriendsAvailable: boolean = false;
  areChallengesAvarilable: boolean = false;
  challengeChartType:string = 'doughnut';
  challengeLabels;
  challengeChartOptions:any = {
    responsive: true
  };
  challengeChartColors:Array<any> = [
    { 
      backgroundColor: 'rgba(248,177,54,0.8)',
      borderColor: 'rgba(248,177,54,0.8)',
      pointBackgroundColor: 'rgba(248,177,54,0.8)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(248,177,54,0.8)'
    }
  ];
  //end chart
  constructor(public navCtrl: NavController, public af: AngularFireDatabase, public navParams: NavParams, private _auth: AuthService) {
    this.icons = ['flame','map','walk','moon'];
    this.units = ['kcal','km','','h'];
    this.date = new Date(Date.now());
    this.today = this.date.getDate().toString();
    this.today +="-"+ (this.date.getMonth()+1).toString();
    this.today +="-"+ this.date.getFullYear().toString();
    af.list('/friendList/'+this._auth.displayNick(), { preserveSnapshot: true }).subscribe(_friends => {
      this.friendsData = [];
      this.challenges = [];
      this.challengesNames = [];
      this.challengesProgress = [];
      this.allFriendsData = [];
      let user;
      let photo = "assets/img/user_icon300.jpg";
      _friends.forEach(_friend => {
        _friend.forEach(_data => {
          /*let photoUrl = af.object('/users/'+_data.val()+'/', { preserveSnapshot: true });
          photoUrl.subscribe(snapshot => {
            photo = snapshot.val();
          });*/

          af.list('/challenges/'+_data.val(), { preserveSnapshot: true }).subscribe(_challenges => {
            this.challengeData = [];
            _challenges.forEach(_challenge =>{
              _challenge.forEach(_item => {
                if (_item.key=="nombre") {
                  this.challengesNames.push(_item.val());
                }else{
                  if (_item.key!="porcentaje") {
                    this.challengeData.push(_item.val());
                    console.log(_item.val(), _data.val());
                  }else{
                    this.challengesProgress.push(_item.val());
                  }
                }
              });
              this.challenges.push(this.challengeData);
              this.challengeData = [];
            });
            this.allFriendsData.push({
              //items: af.list('/daily/+this.today+'/'+_data.key),
              items: af.list('/daily/28-04-2017/'+_data.val(), {
                query: {
                  limitToFirst : 3,
                  orderByKey : true
                }
              }),
              nick : _data.val(),
              user: af.object('/users/'+_data.val()+'/'),
              photo: af.object('/users/'+_data.val()+'/'),
              challenges: this.challenges,
              challengesNames: this.challengesNames,
              challengesProgress: this.challengesProgress
            });
            this.challenges = [];
            this.challengesProgress = [];
            this.challengesNames = [];
          });
          
         
      });
      this.isFriendsAvailable = true;
    });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Friends');
  }
}
