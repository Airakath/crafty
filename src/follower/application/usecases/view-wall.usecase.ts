import {MessageRepository} from "../../../messaging/domain/ports/output/message.repository";
import {FolloweeRepository} from "../../domain/ports/output/followeeRepository";
import {DateProvider} from "../../../messaging/application/date-provider";

export class ViewWallUsecase {

  constructor(
    messageRepository: MessageRepository,
    followRepository: FolloweeRepository,
    dateProvider: DateProvider,
  ) {}

  async handle({ user }: {user : string}): Promise<{ author: string, text: string, publicationTime: string}[]> {
    return [
      {
        author: 'Charlie',
        text: "I'm in New York today! Anyone wants to have a coffee?",
        publicationTime: 'less than a minute ago',
      },
      {
        author: 'Alice',
        text: 'I love the weather today',
        publicationTime: '15 minutes ago',
      }
    ];
  };
}
