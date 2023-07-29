import { Component } from '@angular/core';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent {
  scrollbarOptionsChatConversation: object = {
    scrollbars: {
      autoHide: 'leave',
      autoHideDelay: 200
    },
    overflow: {
      x: "visible-hidden",
      y: "scroll"
    }
  };
}
