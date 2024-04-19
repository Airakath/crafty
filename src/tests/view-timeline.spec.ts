import {createMessagingFixture, MessagingFixture} from "./messaging.fixture";
import {messageBuilder} from "./message.builder";

describe("Feature: Viewing a personal timeline", () => {
  let fixture: MessagingFixture;

  beforeAll(() => {
    fixture = createMessagingFixture();
  });

  describe("Rule: Messages are shown in reverse chronological order", () => {
    test("Alice can view the 3 messages she published in her timeline", async () => {

      const aliceMessageBuilder = messageBuilder().authoredBy("Alice");

      fixture.givenTheFollowingMessagesExist([
        aliceMessageBuilder
          .withId("message-1")
          .withText("My first message")
          .publishedAt(new Date("2023-02-07T16:27:02Z"))
          .build(),
        messageBuilder()
          .withId("message-2")
          .authoredBy('Bob')
          .withText("Hi it's Bob")
          .publishedAt(new Date("2023-02-07T16:32:00Z"))
          .build(),
        aliceMessageBuilder
          .withId("message-3")
          .withText("My second message")
          .publishedAt(new Date("2023-02-07T16:34:00Z"))
          .build(),
        aliceMessageBuilder
          .withId("message-4")
          .withText("My last message")
          .publishedAt(new Date("2023-02-07T16:34:30Z"))
          .build(),
      ]);

      fixture.givenNowIs(new Date("2023-02-07T16:35:00Z"));

      await fixture.whenUserseesTheTimelineOf("Alice");

      fixture.thenUserShouldSee([
        {
          author: "Alice",
          text: "My last message",
          publishedTime: "less than a minute ago",
        },
        {
          author: "Alice",
          text: "My second message",
          publishedTime: "1 minute ago",
        },
        {
          author: "Alice",
          text: "My first message",
          publishedTime: "7 minutes ago",
        },
      ]);

    });
  });

});
