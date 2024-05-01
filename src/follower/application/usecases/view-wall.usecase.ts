import { MessageRepository } from '../../../messaging/domain/ports/output/message.repository';
import { FolloweeRepository } from '../../domain/ports/output/followeeRepository';
import { DateProvider } from '../../../messaging/application/date-provider';
import { TimelineEntity } from '../../../messaging/domain/entities/timeline.entity';


export class ViewWallUsecase {

  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly followRepository: FolloweeRepository,
    private readonly dateProvider: DateProvider,
  ) {}

  async handle({user}: { user: string }): Promise<{ author: string, text: string, publicationTime: string }[]> {

    const followees = await this.followRepository.getFolloweesOf(user);
    const messages = (await Promise.all(
      [user, ...followees].map((user) =>
        this.messageRepository.getAllOfUser((user))
      )
    )).flat();

    console.log(this.dateProvider);

    const timeline = new TimelineEntity(messages, this.dateProvider.getNow());

    return timeline.data;
  }
}
