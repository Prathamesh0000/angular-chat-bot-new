import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

export class Message {
  constructor(public role: string, public content: string) {}
}
export class OpenAiConversation {
  constructor(public model: String, public messages: Array<Message>) {}
}
@Injectable()
export class ChatService {
  constructor(private client: HttpClient) {}

  promptMessages: Array<Message> = new Array<Message>();
  // new Message(
  //   'user',
  //   'Use << or >> to encapsulate any template for example: eg: <<We have an exciting offer on Product.\n We have 10 percent off on the product>>'
  // ),
  // new Message(
  //   'assistant',
  //   'Great, thanks for the tip! How may I assist you further?'
  // )

  conversation = new Subject<Message[]>();
  conversationHistory = new Array<Message>();

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
    this.conversationHistory.push(userMessage);
    const request = this.client.post(
      'https://api.openai.com/v1/chat/completions',
      new OpenAiConversation(
        'gpt-3.5-turbo',
        this.conversationHistory.concat(this.promptMessages)
      ),
      options
    );

    request.subscribe(
      (e) => {
        const response = JSON.stringify(e['choices'][0]['message']['content']);
        const botMessage = new Message(
          'assistant',
          response.slice(1, response.length - 1)
        );
        this.conversation.next([botMessage]);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
