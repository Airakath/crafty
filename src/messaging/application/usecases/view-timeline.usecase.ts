import { MessageRepository } from '../../domain/ports/output/message.repository';
import { DateProvider } from '../date-provider';
import { TimelineEntity } from '../../domain/entities/timeline.entity';


export class ViewTimelineUsecase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly dateProvider: DateProvider,
  ) {}

  async handle({user}: { user: string }): Promise<{
    author: string,
    text: string,
    publicationTime: string
  }[]> {
    const messagesOfUser = await this.messageRepository.getAllOfUser(user);
    const timeline = new TimelineEntity(messagesOfUser, this.dateProvider.getNow());

    return timeline.data;
  }
}
