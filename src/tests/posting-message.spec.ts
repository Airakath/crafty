import {
  DateProvider, EmptyMessageError,
  Message,
  MessageRepository, MessageTooLongError,
  PostMessageCommand,
  PostMessageUsecase
} from "../post-message.usecase";

describe('Feature Posting a message', () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  describe('Rule: A message can contain a maximum of 280 characters', () => {

    test('Alice can post a message on het timeline', () => {
      fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'));
      fixture.whenUserPostsAMessage({
        id: 'message-id',
        text: 'Hello World',
        author: 'Alice',
      });

      fixture.thenPostedMessageShouldBe({
        id: 'message-id',
        text: 'Hello World',
        author: 'Alice',
        publishedAt: new Date('2023-01-19T19:00:00.000Z'),
      });
    });

    test("Alice can't post a message with more than 280 characters", () => {
      const textWith281Characters = 'a'.repeat(281);
      fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'));

      fixture.whenUserPostsAMessage({
        id: 'message-id',
        text: textWith281Characters,
        author: 'Alice',
      });

      fixture.thenErrorShouldBe(MessageTooLongError);

    });
  });

  describe('Rule: A message can not be empty', () => {

    test('Alice cannot post an empty message', () => {
      fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'));

      fixture.whenUserPostsAMessage({
        id: 'message-id',
        text: '',
        author: 'Alice',
      });

      fixture.thenErrorShouldBe(EmptyMessageError);
    });

    test('Alice cannot post an message with only whitespaces', () => {
      fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'));

      fixture.whenUserPostsAMessage({
        id: 'message-id',
        text: '   ',
        author: 'Alice',
      });

      fixture.thenErrorShouldBe(EmptyMessageError);
    });
  });
});


class InMemoryMessageRepository implements MessageRepository {
  message?: Message;
  save(msg: Message): void {
    this.message = msg
  }
}

class StubDateProvider implements DateProvider {
  now!: Date;
  getNow(): Date {
    return this.now;
  }
}


const createFixture = () => {
  const dateProvider = new StubDateProvider();
  const mesaageRepository = new InMemoryMessageRepository();
  const postMessageUsecase = new PostMessageUsecase(mesaageRepository, dateProvider);
  let throwError: Error;

  return {
    givenNowIs: (now: Date) => {
      dateProvider.now = now;
    },
    whenUserPostsAMessage: (postMessageCommand: PostMessageCommand) => {
      try {
        postMessageUsecase.handle(postMessageCommand);
      } catch (err) {
        // @ts-ignore
        throwError = err;
      }
    },
    thenPostedMessageShouldBe(expectedMessage: Message) {
      expect(expectedMessage).toEqual(mesaageRepository.message);
    },
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(throwError).toBeInstanceOf(expectedErrorClass);
    }
  }
}

type Fixture = ReturnType<typeof createFixture>;
