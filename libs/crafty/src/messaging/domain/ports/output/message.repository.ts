import {MessageEntity} from "../../entities/message.entity";
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class MessageRepository {
  abstract save(message: MessageEntity): Promise<void>;
  abstract getAllOfUser(user: string): Promise<MessageEntity[]>;
  abstract getById(messageId: string): Promise<MessageEntity>;
}

