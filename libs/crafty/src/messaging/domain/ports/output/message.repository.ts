import {MessageEntity} from "../../entities/message.entity";

export interface MessageRepository {
  save(message: MessageEntity): Promise<void>;
  getAllOfUser(user: string): Promise<MessageEntity[]>;
  getById(messageId: string): Promise<MessageEntity>;
}

export const IMessageRepository = Symbol('MessageRepository');
