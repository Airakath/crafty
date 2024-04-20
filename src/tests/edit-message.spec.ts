import {createMessagingFixture, MessagingFixture} from "./messaging.fixture";
import {messageBuilder} from "./message.builder";
import {EmptyMessageError, MessageTooLongError} from "../post-message.usecase";

describe('Feature editing a message', () => {
  let fixture: MessagingFixture;

  beforeEach(() => {
    fixture = createMessagingFixture();
  });

  describe('Rule: The edited text should not be superior to 280 characters', () => {
    test('Alice can edit a message to a text inferior to 280 characters', async () => {

      const aliceMessageBuilder = messageBuilder()
        .withId('message-id')
        .authoredBy('Alice')
        .withText('Hello Wrld')

      fixture.givenTheFollowingMessagesExist([
        aliceMessageBuilder.build(),
      ]);

      await fixture.whenUserEditsMessage({
        messageId: 'message-id',
        text: 'Hello World',
      })

      await fixture.thenMessageShouldBe(
        aliceMessageBuilder
          .withText('Hello World')
          .build(),
      );
    });

    test("Alice can not edit her message to a text superior to 280 characters", async () => {
      const textWith281Characters = 'a'.repeat(281);

      const originalAliceMessage = messageBuilder()
        .withId('message-id')
        .authoredBy('Alice')
        .withText('Hello World')
        .build();

      fixture.givenTheFollowingMessagesExist([
        originalAliceMessage,
      ]);

      await fixture.whenUserEditsMessage({
        messageId: 'message-id',
        text: textWith281Characters,
      })

      await fixture.thenMessageShouldBe(originalAliceMessage);
      fixture.thenErrorShouldBe(MessageTooLongError);
    });

    test("Alice can not edit her message to an empty text", async () => {
      const originalAliceMessage = messageBuilder()
        .withId('message-id')
        .authoredBy('Alice')
        .withText('Hello Wrld')
        .build();

      fixture.givenTheFollowingMessagesExist([
        originalAliceMessage,
      ]);

      await fixture.whenUserEditsMessage({
        messageId: 'message-id',
        text: '',
      });

      await fixture.thenMessageShouldBe(originalAliceMessage);
      fixture.thenErrorShouldBe(EmptyMessageError);
    });


    test("Alice can not edit her message to an empty text", async () => {
      const originalAliceMessage = messageBuilder()
        .withId('message-id')
        .authoredBy('Alice')
        .withText('Hello Wrld')
        .build();

      fixture.givenTheFollowingMessagesExist([
        originalAliceMessage,
      ]);

      await fixture.whenUserEditsMessage({
        messageId: 'message-id',
        text: '  ',
      });

      await fixture.thenMessageShouldBe(originalAliceMessage);
      fixture.thenErrorShouldBe(EmptyMessageError);
    });
  });
});
