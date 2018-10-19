import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { Group } from '../../models/group';
import { User } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-new-group',
  templateUrl: 'new-group.html',
})
export class NewGroupPage {

  creating = true;
  group = { 
    title: "", accessCode: "", wakeTime: "", 
    penaltyFee: "", wakeMessage: "", members: [] 
  }

  constructor(public navCtrl: NavController, private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {

  }
  toggleCreating() {
    if (this.creating) { this.creating = false }
    else { this.creating = true }
  }
  joinGroup() {
    if (this.group.title != "" && this.group.accessCode != "") {
      Group.addCurrentUser(this.group.title, this.group.accessCode)
      .then(groupId => User.joinGroup(groupId))
      .then(() => {
        this.showToast('Successfully Joined ' + this.group.title);
        this.navCtrl.pop();
      })
      .catch(error => this.showToast(error));
    } else {
      this.showToast("Please enter the group title and access code before continuing.");
    }
  }
  createGroup() {
    // TODO: Form Validation
    this.showToast('Creating group...');
    Group.create(this.group).then(docRef => {
      this.showToast('Group Successfully Created!');
      this.navCtrl.pop();
    });
  }
  showToast(message) {
    this.toastCtrl.create({
      duration: 3000,
      message: message,
      position: 'bottom'
    }).present();
  }

}
