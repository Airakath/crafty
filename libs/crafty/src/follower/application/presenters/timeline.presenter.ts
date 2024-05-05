import { TimelineEntity } from '../../../messaging/domain/entities/timeline.entity';

export interface TimelinePresenter {
  show(timeline: TimelineEntity): void;
}
