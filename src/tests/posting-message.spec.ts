import {
  EmptyMessageError,
  MessageTooLongError,
} from "../post-message.usecase";
import {createMessagingFixture, MessagingFixture} from "./messaging.fixture";
import {messageBuilder} from "./message.builder";

describe('Feature Posting a message', () => {
  let fixture: MessagingFixture;

  beforeEach(() => {
    fixture = createMessagingFixture();
  });

  describe('Rule: A message can contain a maximum of 280 characters',() => {

    test('Alice can post a message on het timeline', async () => {
      fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'));
      await fixture.whenUserPostsAMessage({
        id: 'message-id',
        text: 'Hello World',
        author: 'Alice',
      });

      await fixture.thenMessageShouldBe(
        messageBuilder()
          .withId('message-id')
          .authoredBy('Alice')
          .withText('Hello World')
          .publishedAt(new Date('2023-01-19T19:00:00.000Z'))
          .build(),
      );
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
