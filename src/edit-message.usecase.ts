import {MessageRepository} from "./message.repository";
import {EmptyMessageError, MessageText, MessageTooLongError} from "./message";

export  type EditMessageCommand = {
  messageId: string;
  text: string;
}
export class EditMessageUsecase {

  constructor(
    private readonly messageRepository: MessageRepository
  ) {}
  async handle(editMessageCommand: EditMessageCommand) {
    const messageText = MessageText.of(editMessageCommand.text);

    const message = await this.messageRepository.getById(editMessageCommand.messageId);

    const editedMessage = {
      ...message,
      text: messageText
    };

    await this.messageRepository.save(editedMessage);
  }
}
