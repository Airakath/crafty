import {MessageRepository} from "../../domain/ports/output/message.repository";
import {MessageEntity} from "../../domain/entities/message.entity";
import {DateProvider} from "../date-provider";

export type PostMessageCommand = {
  id: string;
  text: string;
  author: string;
}

export class PostMessageUsecase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly dateProvider: DateProvider,
  ) {}

  async handle(postMessageCommand: PostMessageCommand) {


    await this.messageRepository.save(MessageEntity.fromData({
      id: postMessageCommand.id,
      text: postMessageCommand.text,
      author: postMessageCommand.author,
      publishedAt: this.dateProvider.getNow(),
    }));
  }
}
