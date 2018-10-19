import { Component } from '@angular/core';
import { ProfilePage } from '../profile/profile';
import { MyGroupsPage } from '../my-groups/my-groups';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = SettingsPage;
  tab2Root = ProfilePage;
  tab3Root = MyGroupsPage;

  constructor() {

  }
}
