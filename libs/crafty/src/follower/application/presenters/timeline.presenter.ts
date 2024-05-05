import { TimelineEntity } from '../../../messaging/domain/entities/timeline.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class TimelinePresenter {
  abstract show(timeline: TimelineEntity): void;
}
