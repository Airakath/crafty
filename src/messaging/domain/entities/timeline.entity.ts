import { MessageEntity } from './message.entity';


export class TimelineEntity{
  constructor(
    private readonly messages: MessageEntity[],
  ) {}

  get data() {
    this.messages.sort(
      (msgA, msgB) => msgB.publishedAt.getTime() - msgA.publishedAt.getTime(),
    );

    return this.messages.map((msg) => msg.data);
  }
}
