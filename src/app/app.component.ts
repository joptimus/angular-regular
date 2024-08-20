import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Check Status', url: '/folder/status', icon: 'help-circle' },
    { title: 'Receive', url: '/folder/recieve', icon: 'cube' },
    { title: 'Facilities', url: '/folder/facilities', icon: 'location' },
    { title: 'ID Check', url: '/folder/id', icon: 'id-card' },
    { title: 'Capture', url: '/folder/webcam', icon: 'videocam' },

  ];
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}
}
