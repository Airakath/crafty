import { MessageRepository } from '../../domain/ports/output/message.repository';
import { DateProvider } from '../date-provider';
import { TimelineEntity } from '../../domain/entities/timeline.entity';
import { TimelinePresenter } from '../../../follower/application/presenters/timeline.presenter';


export class ViewTimelineUsecase {
  constructor(
    private readonly messageRepository: MessageRepository,
  ) {}

  async handle({user}: { user: string }, timelinePresenter: TimelinePresenter): Promise<void> {
    const messagesOfUser = await this.messageRepository.getAllOfUser(user);
    const timeline = new TimelineEntity(messagesOfUser);

    timelinePresenter.show(timeline);
  }
}
