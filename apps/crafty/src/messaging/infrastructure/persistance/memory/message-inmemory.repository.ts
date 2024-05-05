import {MessageRepository} from "../../../domain/ports/output/message.repository";
import {MessageEntity} from "../../../domain/entities/message.entity";

export class InMemoryMessageRepository implements MessageRepository {
  messages = new Map<string, MessageEntity>;
  async save(msg: MessageEntity): Promise<void> {
    this._save(msg);

    return Promise.resolve();
  }

  getMessageById(messageId: string): MessageEntity | undefined {
    return this.messages.get(messageId);
  }

  givenExistingMessages(messages: MessageEntity[]) {
    messages.forEach(
      this._save.bind(this)
    );
  }

  getAllOfUser(user: string): Promise<MessageEntity[]> {
    return Promise.resolve(
      [...this.messages.values()]
        .filter((msg) => msg.author === user)
        .map((msg) => (MessageEntity.fromData({
          id: msg.id,
          author: msg.author,
          text: msg.text,
          publishedAt: msg.publishedAt,
        })))
    );
  }

  getById(messageId: string): Promise<MessageEntity> {
    return Promise.resolve(this.getMessageById(messageId));
  }

  private _save(msg: MessageEntity) {
    this.messages.set(msg.id, msg);
  }
}
