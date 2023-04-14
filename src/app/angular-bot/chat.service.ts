import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

export class Message {
  constructor(public role: string, public content: string) {}
}
export class OpenAiConversation{
  constructor(public model: String, public messages: Array<Message>) {}
}
@Injectable()
export class ChatService {
  constructor(private client: HttpClient) {}

  conversation = new Subject<Message[]>();
  conversationHistory = new OpenAiConversation("gpt-3.5-turbo" , new Array<Message>)

  getBotAnswer(msg: string) {
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set(
        'Authorization',
        'Bearer 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'
      );
    const options = { headers: headers };
    const userMessage = new Message('user', msg);
    this.conversation.next([userMessage]);
    this.conversationHistory.messages.push(userMessage)
    const request = this.client.post(
      'https://api.openai.com/v1/chat/completions',
      this.conversationHistory,
      options
    );

    request.subscribe((e) => {
      const response = JSON.stringify(e['choices'][0]['message']['content']);
      const botMessage = new Message('bot', response.slice(1, response.length-1));
      setTimeout(() => {
        this.conversation.next([botMessage]);
      }, 1500);
    });
  }
}
