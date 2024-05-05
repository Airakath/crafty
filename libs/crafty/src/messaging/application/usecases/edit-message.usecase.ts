import {MessageRepository} from "../../domain/ports/output/message.repository";
import { EmptyMessageError, MessageTooLongError } from '../../domain/entities/message.entity';
import { Err, Ok, Result } from '../../../shared/result';

export  type EditMessageCommand = {
  messageId: string;
  text: string;
}
export class EditMessageUsecase {

  constructor(
    private readonly messageRepository: MessageRepository
  ) {}
  async handle(editMessageCommand: EditMessageCommand): Promise<Result<void, EmptyMessageError | MessageTooLongError>> {

    const message = await this.messageRepository.getById(editMessageCommand.messageId);

    try {
      message.editText(editMessageCommand.text);
    } catch (error) {
      return Err.of(error);
    }

    await this.messageRepository.save(message);

    return Ok.of(undefined);
  }
}
