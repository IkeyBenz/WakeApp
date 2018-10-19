import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { Chat } from '../../models/chat';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  chat = {};

  constructor(public navCtrl: NavController, private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.showToast('Loading Messages...');
    Chat.load().then(chatInfo => {
      this.chat = chatInfo;
    });
  }

  showToast(message) {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
  }

}
