import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { Chat } from '../../models/chat';
import { auth } from '../../models/firebase';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  chat = { };
  showTabs = false;
  newMessage = { text: "", author: auth.currentUser.displayName }

  constructor(public navCtrl: NavController, private toastCtrl: ToastController) {
    
  }
  
  ionViewDidLoad() {
    Chat.onUpdate(this.setChatDetails.bind(this));
  }
  setChatDetails(chatInfo) {
    this.chat = chatInfo;
  }
  showToast(message) {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
  }
  sendMessage() {
    Chat.postMessage(this.newMessage);
  }

}
