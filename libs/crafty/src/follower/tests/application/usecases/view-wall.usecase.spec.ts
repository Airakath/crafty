import {createMessagingFixture, MessagingFixture} from "../../../../messaging/tests/application/usecases/messaging.fixture";
import {messageBuilder} from "../../../../messaging/tests/message.builder";
import {createFollowingFixture, FollowingFixture} from "./following.fixture";
import { createWallFixture, Fixture } from './wall.fixture';

describe('Feature: Viewing a wall', () => {

  let messagingFixture: MessagingFixture;
  let followingFixture: FollowingFixture;
  let fixture: Fixture;

  beforeEach(() => {
    messagingFixture = createMessagingFixture();
    followingFixture = createFollowingFixture();
    fixture = createWallFixture({
      messageRepository: messagingFixture.messageRepository,
      followeeRepository: followingFixture.followeeRepository
    });
  });

  describe("Rule All the message freom the user and her followeees should appear in reverse chronological order", () => {
    test("Charlie has subscribed to Alice's, timelines, and thus can view an aggregated list of all subscription",async () => {
      fixture.givenNowIs(new Date("2023-02-09T15:15:30.000Z"));
      messagingFixture.givenTheFollowingMessagesExist([
        messageBuilder()
          .withId('m1')
          .authoredBy('Alice')
          .withText('I love the weather today')
          .publishedAt(new Date('2023-02-09T15:00:30Z'))
          .build(),
        messageBuilder()
          .withId('m2')
          .authoredBy('Bob')
          .withText('Damn! We lost!')
          .publishedAt(new Date('2023-02-09T15:10:00Z'))
          .build(),
        messageBuilder()
          .withId('m3')
          .authoredBy('Charlie')
          .withText("I'm in New York today! Anyone wants to have a coffee?")
          .publishedAt(new Date('2023-02-09T15:15:00Z'))
          .build()
      ]);

      followingFixture.givenUserFollowees({
        user: 'Charlie',
        followees: ['Alice'],
      });

      await fixture.whenUserSeesTheWallOf('Charlie');

      fixture.thenUserShouldSee([
        {
          author: 'Charlie',
          text: "I'm in New York today! Anyone wants to have a coffee?",
          publicationTime: 'less than a minute ago',
        },
        {
          author: 'Alice',
          text: 'I love the weather today',
          publicationTime: '15 minutes ago',
        }
      ]);

    });
  });
});

