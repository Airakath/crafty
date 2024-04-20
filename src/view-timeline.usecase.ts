import {MessageRepository} from "./message.repository";
import {DateProvider} from "./post-message.usecase";

const ONE_MINUTE_IN_MS = 60 * 1000;

export class ViewTimelineUsecase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly dateProvider: DateProvider
  ) {}

  async handle({ user}: { user: string }) : Promise<{
    author: string,
    text: string,
    publishedTime: string
  }[]> {
    const messageOfUser = await this.messageRepository.getAllOfUser(user);
    messageOfUser.sort(
      (msgA, msgB) => msgB.publishedAt.getTime() - msgA.publishedAt.getTime()
    );


    return messageOfUser.map(msg => ({
      author: msg.author,
      text:  msg.text.value,
      publishedTime: this.publicationIme(msg.publishedAt)
    }));
  }

  private publicationIme(publishedAt: Date): string {
    const now  = this.dateProvider.getNow();
    const diff = now.getTime() - publishedAt.getTime();
    const minutes = Math.floor(diff / ONE_MINUTE_IN_MS);

    if (minutes < 1) {
      return "less than a minute ago";
    }
    if(minutes < 2) {
      return "1 minute ago";
    }

    return `${minutes} minutes ago`;
  }

}
