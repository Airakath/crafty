import { MessageRepository } from '../../../messaging/domain/ports/output/message.repository';
import { FolloweeRepository } from '../../domain/ports/output/followee.repository';
import { DateProvider } from '../../../messaging/application/date-provider';
import { TimelineEntity } from '../../../messaging/domain/entities/timeline.entity';
import { TimelinePresenter } from '../presenters/timeline.presenter';


export class ViewWallUsecase {

  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly followRepository: FolloweeRepository,
  ) {}

  async handle({user}: { user: string }, timelinePresenter: TimelinePresenter): Promise<void> {

    const followees = await this.followRepository.getFolloweesOf(user);
    const messages = (await Promise.all(
      [user, ...followees].map((user) =>
        this.messageRepository.getAllOfUser((user))
      )
    )).flat();

    const timeline = new TimelineEntity(messages);

    timelinePresenter.show(timeline);
  }
}
