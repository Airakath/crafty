import { IMessageRepository, MessageRepository } from '../../domain/ports/output/message.repository';
import { EmptyMessageError, MessageEntity, MessageTooLongError } from '../../domain/entities/message.entity';
import {DateProvider} from "../date-provider";
import { Err, Ok, Result } from '../../../shared/result';
import { Inject, Injectable } from '@nestjs/common';

export type PostMessageCommand = {
  id: string;
  text: string;
  author: string;
}

@Injectable()
export class PostMessageUsecase {
  constructor(
    @Inject(IMessageRepository) private readonly messageRepository: MessageRepository,
    private readonly dateProvider: DateProvider,
  ) {}

  async handle(postMessageCommand: PostMessageCommand): Promise<Result<void, EmptyMessageError | MessageTooLongError>> {
    let message: MessageEntity;
    try {
      message = MessageEntity.fromData({
        id: postMessageCommand.id,
        text: postMessageCommand.text,
        author: postMessageCommand.author,
        publishedAt: this.dateProvider.getNow(),
      });
    } catch (error) {
      return Err.of(error);
    }

    await this.messageRepository.save(message);

    return Ok.of(undefined);
  }
}
