import { Component } from '@angular/core';
import { Chat, ChatDummy, Message, User, UserDummy } from "../utility.models";
import { HttpService } from "../http.service";
import { interval, mergeMap } from "rxjs";

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
  isEmojiMartVisible = false;

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
    interval(1000)
      .pipe(mergeMap(() => this._httpService.getCurrentUser()))
      .subscribe(data => {
        // since chats is not included, use old chat data first before the new data arrived
        if (this.userData != null) {
          data.chats = this.userData.chats;
        }
        this.userData = data;
        this.getChats();
      });
  }

  getChats(): void {
    this._httpService.getCurrentUserChats().subscribe(chats => {
        this.userData!.chats = chats;
        if (this.userData!.chats.length > 0) {
          this.selectedChat = this.selectedChat != null
            ? this.userData!.chats.find(c => c.id == this.selectedChat!.id)!
            : this.userData!.chats[0];
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

  isInputNotEmpty() {
    return this.selectedChat != null && this.messagesEntered[this.selectedChat.id].content.length > 0;
  }

  sendMessage() {
    this.isEmojiMartVisible = false;
    if (this.selectedChat == null || this.userData == null) {
      return;
    }
    let newMessage: Message = this.messagesEntered[this.selectedChat.id];
    if (newMessage.content.length == 0) {
      return;
    }
    newMessage.chat = ChatDummy(this.selectedChat);
    newMessage.sender = UserDummy(this.userData);
    this._httpService.newMessage(newMessage).subscribe();
    this.messagesEntered[this.selectedChat.id] = {content: ""} as Message;
  }

  addEmoji(event: any) {
    this.messagesEntered[this.selectedChat!.id].content += event.emoji.native;
  }
}
