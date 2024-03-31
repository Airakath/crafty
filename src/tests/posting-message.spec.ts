import {
  DateProvider,
  Message,
  MessageRepository,
  PostMessageCommand,
  PostMessageUsecase
} from "../post-message.usecase";

describe('Feature Posting a message', () => {
  describe('Rule: A message can contain a maximum of 280 characters', () => {
    test('Alice can post a message on het timeline', () => {
      givenNowIs(new Date('2023-01-19T19:00:00.000Z'));
      whenUserPostsAMessage({
        id: 'message-id',
        text: 'Hello World',
        author: 'Alice',
      });

      thenPostedMessageShouldBe({
        id: 'message-id',
        text: 'Hello World',
        author: 'Alice',
        publishedAt: new Date('2023-01-19T19:00:00.000Z'),
      });
    });
  });
});

let message: Message;

class InMemoryMessageRepository implements MessageRepository {
  save(msg: Message): void {
    message = msg
  }
}

class StubDateProvider implements DateProvider {
  now?: Date

  getNow(): Date {
    return this.now!;
  }
}

const mesaageRepository = new InMemoryMessageRepository();
const dateProvider = new StubDateProvider();

const postMessageUsecase = new PostMessageUsecase(
  mesaageRepository,
  dateProvider
);

function givenNowIs(_now: Date) {
  dateProvider.now = _now;
}

function whenUserPostsAMessage(postMessageCommand: PostMessageCommand) {
  postMessageUsecase.handle(postMessageCommand);
}

function thenPostedMessageShouldBe(expectedMessage: Message) {
  expect(expectedMessage).toEqual(message);
}

