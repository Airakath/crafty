import {
  EmptyMessageError,
  MessageTooLongError,
  PostMessageCommand,
  PostMessageUsecase
} from "../post-message.usecase";
import {InMemoryMessageRepository} from "../message-inmemory.repository";
import {Message} from "../message";
import {StubDateProvider} from "../stub-date-provider";

describe('Feature Posting a message', () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  describe('Rule: A message can contain a maximum of 280 characters',() => {

    test('Alice can post a message on het timeline', async () => {
      fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'));
      await fixture.whenUserPostsAMessage({
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

    test("Alice can't post a message with more than 280 characters", async () => {
      const textWith281Characters = 'a'.repeat(281);
      fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'));

      await fixture.whenUserPostsAMessage({
        id: 'message-id',
        text: textWith281Characters,
        author: 'Alice',
      });

      fixture.thenErrorShouldBe(MessageTooLongError);

    });
  });

  describe('Rule: A message can not be empty', () => {

    test('Alice cannot post an empty message', async () => {
      fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'));

      await fixture.whenUserPostsAMessage({
        id: 'message-id',
        text: '',
        author: 'Alice',
      });

      fixture.thenErrorShouldBe(EmptyMessageError);
    });

    test('Alice cannot post an message with only whitespaces', async () => {
      fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'));

      await fixture.whenUserPostsAMessage({
        id: 'message-id',
        text: '   ',
        author: 'Alice',
      });

      fixture.thenErrorShouldBe(EmptyMessageError);
    });
  });
});


const createFixture = () => {
  const dateProvider = new StubDateProvider();
  const mesaageRepository = new InMemoryMessageRepository();
  const postMessageUsecase = new PostMessageUsecase(mesaageRepository, dateProvider);
  let throwError: Error;

  return {
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },
    async whenUserPostsAMessage(postMessageCommand: PostMessageCommand) {
      try {
        await postMessageUsecase.handle(postMessageCommand);
      } catch (err) {
        throwError = err;
      }
    },
    thenPostedMessageShouldBe(expectedMessage: Message) {
      expect(expectedMessage).toEqual(mesaageRepository.getMessageById(expectedMessage.id));
    },
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(throwError).toBeInstanceOf(expectedErrorClass);
    }
  }
}

type Fixture = ReturnType<typeof createFixture>;
