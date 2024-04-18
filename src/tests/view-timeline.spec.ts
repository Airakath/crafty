import {InMemoryMessageRepository} from "../message-inmemory.repository";
import {ViewTimelineUsecase} from "../view-timeline.usecase";
import {Message} from "../message";

describe("Feature: Viewing a personal timeline", () => {
  let fixture: Fixture;

  beforeAll(() => {
    fixture = createFixture();
  });

  describe("Rule: Messages are shown in reverse chronological order", () => {
    test("Alice can view the 2 messages she published in her timeline", async () => {
      fixture.givenTheFollowingMessagesExist([
        {
          author: "Alice",
          text: "My first message",
          id: "message-1",
          publishedAt: new Date("2023-02-07T16:28:00Z"),
        },
        {
          author: "Bob",
          text: "Hi it's Bob",
          id: "message-2",
          publishedAt: new Date("2023-02-07T16:32:00Z"),
        },
        {
          author: "Alice",
          text: "My second message",
          id: "message-3",
          publishedAt: new Date("2023-02-07T16:34:00Z"),
        },
      ]);

      fixture.giveNowIs(new Date("2023-02-07T16:35:00Z"));

      await fixture.whenUserseesTheTimelineOf("Alice");

      fixture.thenUserShouldSee([
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

const createFixture = () => {
  let timeline: {
    author: string,
    text: string,
    publishedTime: string
  }[];
  const messageRepository = new InMemoryMessageRepository();
  const viewTimelineUseCase = new ViewTimelineUsecase(messageRepository);
  return {
    givenTheFollowingMessagesExist(messages: Message[]) {
      messageRepository.givenExistingMessages(messages);
    },
    giveNowIs(now: Date) {},
    async whenUserseesTheTimelineOf(user: string) {
      timeline = await viewTimelineUseCase.handle({ user });
    },
    thenUserShouldSee(expectedTimeline: {author: string, text: string, publishedTime: string}[]) {
      expect(timeline).toEqual(expectedTimeline);
    }
  }
};

type Fixture = ReturnType<typeof createFixture>;
