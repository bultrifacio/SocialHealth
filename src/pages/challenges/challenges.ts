import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../../providers/auth-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-challenges',
  templateUrl: 'challenges.html',
})
export class ChallengesPage {
  challengeForm : FormGroup;
  submitted = false;
  challengeRef : any;
  friends : any;
  challenges : any;
  challengeData : any;
  fields = ['Cantidad','Objetivo'];
  challengesKeys : any;
  challengesNames : any;
  selectedFriends:string[] = [];
  constructor(public formBuilder : FormBuilder,public af: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams ,private _auth: AuthService) {
    this.challengeForm = formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.pattern('^[a-z.A-Z_ 0-9]*$')])],
      objective: ['', Validators.required],
      quantity: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])]
    });
    
    this.challengeRef = af.list('/challenges/'+this._auth.displayNick()+'/');
    af.list('/friendList/'+this._auth.displayNick(), { preserveSnapshot: true }).subscribe(_friends => {
      this.friends = [];
      _friends.forEach(_friend => {
        _friend.forEach(_data => {
          this.friends.push(_data.val());
      });
      });
    });
    af.list('/challenges/'+this._auth.displayNick(), { preserveSnapshot: true }).subscribe(_challenges => {
      this.challenges = [];
      this.challengeData = [];
      this.challengesKeys = [];
      this.challengesNames = [];
      _challenges.forEach(_challenge => {
        this.challengesKeys.push(_challenge.key);
        _challenge.forEach(_data => {
          if (_data.key=="nombre") {
            this.challengesNames.push(_data.val());
          }else{
            if (_data.key!="porcentaje") {
              this.challengeData.push(_data.val()); 
            }
          }
      });
        this.challenges.push(this.challengeData);
        this.challengeData = [];
      });
    });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Challenges');
  }
  clickFriendsSelectBox(friend){
    const foundAt = this.selectedFriends.indexOf(friend);
    if (foundAt >= 0) {
      this.selectedFriends.splice(foundAt, 1);
    } else {
      this.selectedFriends.push(friend);
    }   
  }
  onSubmit() { 
    this.submitted = true;
    if (this.challengeForm.valid) {
      this.challengeRef.push({
        nombre : this.challengeForm.controls.name.value,
        cantidad : this.challengeForm.controls.quantity.value,
        objetivo : this.challengeForm.controls.objective.value,
        porcentaje : "0"
      });
      for (var friend of this.selectedFriends) {
        this.af.list('/challenges/'+friend+'/').push({
          nombre : this.challengeForm.controls.name.value,
          cantidad : this.challengeForm.controls.quantity.value,
          objetivo : this.challengeForm.controls.objective.value,
          porcentaje : "0"
        });
    }
    this.challengeForm.reset();
  }
    
    
  }
  removeChallenge(index) {
    this.af.list('/challenges/'+this._auth.displayNick()).remove(this.challengesKeys[index]);
    this.af.list('/challenges/'+this._auth.displayNick(), { preserveSnapshot: true }).subscribe(_challenges => {
      this.challenges = [];
      this.challengeData = [];
      this.challengesKeys = [];
      this.challengesNames = [];
      _challenges.forEach(_challenge => {
        this.challengesKeys.push(_challenge.key);
        _challenge.forEach(_data => {
          if (_data.key=="nombre") {
            this.challengesNames.push(_data.val());
          }else{
            if (_data.key!="porcentaje") {
              this.challengeData.push(_data.val()); 
            }
          }
      });
        this.challenges.push(this.challengeData);
        this.challengeData = [];
      });
    });
  }

}
