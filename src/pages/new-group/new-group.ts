import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-new-group',
  templateUrl: 'new-group.html',
})
export class NewGroupPage {

  creating = true;
  accessCode = "";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewGroupPage');
  }
  toggleCreating() {
    if (this.creating) { this.creating = false }
    else { this.creating = true }
  }
  joinGroup() {

  }
  createGroup() {
    
  }

}
