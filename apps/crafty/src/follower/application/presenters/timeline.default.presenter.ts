import { TimelinePresenter } from './timeline.presenter';
import { TimelineEntity } from '../../../messaging/domain/entities/timeline.entity';
import { DateProvider } from '../../../messaging/application/date-provider';

const ONE_MINUTE_IN_MS = 60 * 1000;

export class DefaultTimelinePresenter implements TimelinePresenter {

  constructor(private readonly dateProvider: DateProvider) {}

  show(timeline: TimelineEntity): { author: string, text: string, publicationTime: string}[] {
    const messages = timeline.data;
    return messages.map((msg) => ({
      author: msg.author,
      text: msg.text,
      publicationTime: this.publicationTime(msg.publishedAt)
    }));
  }

  private publicationTime(publishedAt: Date): string {
    const now = this.dateProvider.getNow();
    const diff = now.getTime() - publishedAt.getTime();
    const minutes = Math.floor(diff / ONE_MINUTE_IN_MS);

    if (minutes < 1) {
      return 'less than a minute ago';
    }
    if (minutes < 2) {
      return '1 minute ago';
    }

    return `${minutes} minutes ago`;
  }
}
