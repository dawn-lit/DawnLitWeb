import { Component } from '@angular/core';
import { Chat, ChatDummy, Message, User, UserDummy } from "../utility.models";
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
        this.getChats();
      }
    });
  }

  getChats(): void {
    this.selectedChat = null;
    this._httpService.getCurrentUserChats().subscribe(chats => {
        this.userData!.chats = chats;
        if (this.userData!.chats.length > 0) {
          this.selectedChat = this.userData!.chats[0];
        }
      }
    );
  }

  removeChat() {
    if (this.selectedChat == null) {
      return;
    }
    this._httpService.removeChat(this.selectedChat.id).subscribe(() => this.getChats());
  }

  sendMessage() {
    if (this.selectedChat == null || this.userData == null) {
      return;
    }
    let newMessage: Message = this.messagesEntered[this.selectedChat.id];
    newMessage.chat = ChatDummy(this.selectedChat);
    newMessage.sender = UserDummy(this.userData);
    this._httpService.newMessage(newMessage).subscribe(() => {
      this.getUserData();
    });
    this.messagesEntered[this.selectedChat.id] = {content: ""} as Message;
  }
}
