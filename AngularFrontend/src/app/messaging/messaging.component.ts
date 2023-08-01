import { Component } from '@angular/core';
import { Chat, Message, User } from "../utility.models";
import { HttpService } from "../http.service";

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
  userData: User | null = null;
  selectedChat: Chat | null = null;
  messagesEntered: Record<number, Message> = {};

  constructor(
    private _httpService: HttpService,
  ) {
  }

  ngOnInit(): void {
    this.getUserData();
  }

  getMessageEntered(theChat: Chat): Message {
    if (!(theChat.id in this.messagesEntered)) {
      this.messagesEntered[theChat.id] = {content: ""} as Message;
    }
    return this.messagesEntered[theChat.id];
  }

  getUserData(): void {
    this._httpService.getCurrentUser().subscribe(data => {
      if (data != null && Object.keys(data).length > 0) {
        this.userData = data;
        this.selectedChat = null;
        for (let i = 0; i < this.userData.chats.length; i++) {
          this._httpService.getChat(this.userData.chats[i].id).subscribe(chat => {
            this.userData!.chats[i] = chat;
            if (i == 0) {
              this.selectedChat = chat;
            }
          });
        }
      }
    });
  }

  removeChat() {
    if (this.selectedChat == null) {
      return;
    }
    this._httpService.removeChat(this.selectedChat.id).subscribe(() => this.getUserData());
  }

  sendMessage() {
    if (this.selectedChat == null || this.userData == null) {
      return;
    }
    let newMessage: Message = this.messagesEntered[this.selectedChat.id];
    newMessage.chat = {
      id: this.selectedChat.id,
      owner: {id: this.selectedChat.owner.id} as User,
      target: {id: this.selectedChat.target.id} as User
    } as Chat;
    newMessage.sender = {id: this.userData.id} as User;
    this._httpService.newMessage(newMessage).subscribe(() => {
      this.getUserData();
    });
    this.messagesEntered[this.selectedChat.id] = {content: ""} as Message;
  }
}
