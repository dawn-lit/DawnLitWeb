import { Component } from '@angular/core';
import { Chat, ChatDummy, Message, User, UserDummy } from "../utility.models";
import { HttpService } from "../http.service";
import { interval, mergeMap } from "rxjs";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { tokenGetter } from "../app.module";

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
  currentUser: User = {id: 0, chats: [] as Array<Chat>} as User;
  selectedChat: Chat | null = null;
  messagesEntered: Record<number, Message> = {};
  isEmojiMartVisible = false;
  public messages: string[] = [];
  private _connection: HubConnection | null = null;

  constructor(
    private _httpService: HttpService,
  ) {
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.connectSignalrHub().then();
  }

  async connectSignalrHub() {
    this._connection = new HubConnectionBuilder()
      .withUrl("/signalr", {
        accessTokenFactory: () => tokenGetter()!,
      })
      //.configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();
    this._connection.on('ReceiveMessage', (user, message) => {
      this.messages.push(`${user}: ${message}`);
    });
    try {
      await this._connection.start();
      console.log('Connected to SignalR hub');
    } catch (error) {
      console.error('Failed to connect to SignalR hub', error);
    }
  }

  getMessageEntered(theChat: Chat): Message {
    if (!(theChat.id in this.messagesEntered)) {
      this.messagesEntered[theChat.id] = {content: ""} as Message;
    }
    return this.messagesEntered[theChat.id];
  }

  getCurrentUser(): void {
    interval(1000)
      .pipe(mergeMap(() => this._httpService.getCurrentUser()))
      .subscribe(data => {
        // since chats is not included, use old chat data first before the new data arrived
        data.chats = this.currentUser.chats;
        this.currentUser = data;
        this.getChats();
      });
  }

  getChats(): void {
    this._httpService.getCurrentUserChats().subscribe(chats => {
        this.currentUser.chats = chats;
        if (this.currentUser.chats.length > 0) {
          this.selectedChat = this.selectedChat != null
            ? this.currentUser.chats.find(c => c.id == this.selectedChat!.id)!
            : this.currentUser.chats[0];
        }
      }
    );
  }

  removeChat() {
    if (this.selectedChat == null) {
      return;
    }
    this._httpService.removeChat(this.selectedChat.id).subscribe(() => {
      this.getChats();
      this.selectedChat = null;
    });
  }

  isInputNotEmpty() {
    return this.selectedChat != null && this.messagesEntered[this.selectedChat.id].content.length > 0;
  }

  sendMessage() {
    this.isEmojiMartVisible = false;
    if (this.selectedChat == null || this.currentUser.id <= 0) return;
    // get the message that will be sent
    let newMessage: Message = this.messagesEntered[this.selectedChat.id];
    // make sure message is not empty
    if (newMessage.content.length == 0) return;
    // attach dummies
    newMessage.chat = ChatDummy(this.selectedChat);
    newMessage.sender = UserDummy(this.currentUser);
    // send the message
    this._httpService.newMessage(newMessage).subscribe();
    this.messagesEntered[this.selectedChat.id] = {content: ""} as Message;
  }

  addEmoji(event: any) {
    this.messagesEntered[this.selectedChat!.id].content += event.emoji.native;
  }
}
