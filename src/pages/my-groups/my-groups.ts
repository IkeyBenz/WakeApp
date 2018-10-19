import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { auth } from '../../models/firebase';
import { Group } from '../../models/group';
import { Chat } from '../../models/chat';

@Component({
  selector: 'page-my-groups',
  templateUrl: 'my-groups.html',
})
export class MyGroupsPage {

  loggedIn = false;
  groups = [];

  constructor(public navCtrl: NavController, private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    if (auth.currentUser) {
      this.showToast('Updating Chats...');
      this.loggedIn = true;
      Group.getGroupsFor(auth.currentUser.uid).then(groups => {
        this.groups = groups;
        console.log(this.groups);
      }).catch(this.showToast);
    } else {
      this.loggedIn = false;
    }
  }

  showNewGroupPage() {
    this.navCtrl.push("NewGroupPage");
  }
  openChat(chatId) {
    console.log(chatId);
    Chat.setCurrentChat(chatId);
    this.navCtrl.push("ChatPage");
  }
  showToast(message) {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    }).present();
  }

}
