import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { User } from '../../models/user';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  newUser = { name: { first: "", last: "" }, email: "", password: "" }
  currentUser = false;
  loggingIn = true;
  

  constructor(public navCtrl: NavController, private toastCtrl: ToastController) {

  }


  ionViewDidLoad() {
    this.showToast("Hey there good lookin'");
    User.authStateChanged(function(data) {
      console.log(data);
      if (data.error) {
        this.showToast(data.error.message);
      } else if (data.user) {
        this.currentUser = data.user;
      } else {
        this.currentUser = null;
      }
    }.bind(this));
  }

  toggleLogginIn() {
    if (this.loggingIn) { 
      this.loggingIn = false;
    } else {
      this.loggingIn = true;
    }
  }
  logUserIn() {
    User.logIn(this.newUser.email, this.newUser.password)
    .then(userCredential => {
      this.showToast('Logged in as ' + userCredential.user.email);
    }).catch(error => {
      this.showToast(error.message);
    });
  }
  logUserOut() {
    console.log("Uh hey this is actually getting called.");
    User.logOut();
  }
  createUserAccount() {
    User.signUp(this.newUser).then(user => {
      this.showToast(`We've created your account, ${user.displayName}!`);
      this.loggingIn = true;
    }).catch(error => {
      this.showToast(error.message);
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
