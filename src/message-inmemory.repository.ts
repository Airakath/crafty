import {MessageRepository} from "./message.repository";
import {Message} from "./message";

export class InMemoryMessageRepository implements MessageRepository {
  messages = new Map<string, Message>;
  async save(msg: Message): Promise<void> {
    this._save(msg);

    return Promise.resolve();
  }

  getMessageById(messageId: string): Message | undefined {
    return this.messages.get(messageId);
  }

  givenExistingMessages(messages: Message[]) {
    messages.forEach(
      this._save.bind(this)
    );
  }

  getAllOfUser(user: string): Promise<Message[]> {
    return Promise.resolve(
      [...this.messages.values()]
        .filter((msg) => msg.author === user)
        .map((msg) => ({
          id: msg.id,
          author: msg.author,
          text: msg.text,
          publishedAt: msg.publishedAt,
        }))
    );
  }

  getById(messageId: string): Promise<Message> {
    return Promise.resolve(this.getMessageById(messageId));
  }

  private _save(msg: Message) {
    this.messages.set(msg.id, msg);
  }
}
