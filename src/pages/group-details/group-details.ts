import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Group } from '../../models/group';
import { User } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-group-details',
  templateUrl: 'group-details.html',
})
export class GroupDetailsPage {

  groupDetails;
  groupMembers;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.groupDetails = this.navParams.get('groupDetails');
    User.getAllWithIds(this.groupDetails.members).then(members => {
      this.groupMembers = members;
    });
  }

  ionViewDidLoad() {
    Group.onUpdate(this.groupDetails.id, this.displayGroupDetails.bind(this));
  }

  displayGroupDetails(groupDetails) {
    this.groupDetails = groupDetails;
  }

  edit(param, paramName) {
    const groupId = this.navParams.get('groupDetails').id;
    function updateParam(data) {
      Group.update(groupId, data)
    }
    function cancel(data) {
      console.log('Cancel Clicked');
    }
    this.alertCtrl.create({
      title: `Update ${paramName}`,
      inputs: [ { name: param, placeholder: this.groupDetails[param] } ],
      buttons: [ 
        { text: 'Cancel', role: 'cancel', handler: cancel },
        { text: 'Update',  handler: updateParam }
      ]
    }).present();
  }

}
