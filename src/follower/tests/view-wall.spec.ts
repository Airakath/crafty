import {createMessagingFixture, MessagingFixture} from "../../messaging/tests/messaging.fixture";
import {messageBuilder} from "../../messaging/tests/message.builder";
import {createFollowingFixture, FollowingFixture} from "./following.fixture";
import {StubDateProvider} from "../../messaging/infrastructure/stub-date-provider";
import {ViewWallUsecase} from "../application/usecases/view-wall.usecase";
import {MessageRepository} from "../../messaging/domain/ports/output/message.repository";
import {FolloweeRepository} from "../domain/ports/output/followeeRepository";

describe('Feature: Viewing a wall', () => {

  let messagingFixture: MessagingFixture;
  let followingFixture: FollowingFixture;
  let fixture: Fixture;

  beforeEach(() => {
    messagingFixture = createMessagingFixture();
    followingFixture = createFollowingFixture();
    fixture = createFixture({
      messageRepository: messagingFixture.messageRepository,
      followeeRepository: followingFixture.followeeRepository
    });
  });

  describe("Rule All the message freom the user and her followeees should appear in reverse chronological order", () => {
    test("Charlie has subscribed to Alice's, timelines, and thus can view an aggregated list of all subscription",async () => {

      messagingFixture.givenTheFollowingMessagesExist([
        messageBuilder()
          .authoredBy('Alice')
          .withText('I love the weather today')
          .publishedAt(new Date('2023-02-09T15:00:30.00Z'))
          .build(),
        messageBuilder()
          .authoredBy('Bob')
          .withText('Damn! We lost!')
          .publishedAt(new Date('2023-02-09T15:10:00.00Z'))
          .build(),
        messageBuilder()
          .authoredBy('Charlie')
          .withText("I'm in New York today! Anyone wants to have a coffee?")
          .publishedAt(new Date('2023-02-09T15:15:00.00Z'))
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

const  createFixture = ({
  messageRepository,
  followeeRepository
}: {
  messageRepository: MessageRepository,
  followeeRepository: FolloweeRepository
}) => {
  let wall: { author: string, text: string, publicationTime: string}[] = [];
  const dateProvider = new StubDateProvider()
  const viewWallUsecase = new ViewWallUsecase(
    messageRepository,
    followeeRepository,
    dateProvider
  );
  return {
    givenNowIS(now: Date) {
      dateProvider.now = now;
    },
    async whenUserSeesTheWallOf(user: string) {
      wall = await viewWallUsecase.handle({user});
    },
    thenUserShouldSee(wallexpectedWall: { author: string, text: string, publicationTime: string}[]) {
      expect(wall).toEqual(wallexpectedWall);
    }
  }
}

type Fixture = ReturnType<typeof createFixture>;
