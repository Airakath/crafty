import {StubDateProvider} from "../stub-date-provider";
import {InMemoryMessageRepository} from "../message-inmemory.repository";
import {PostMessageCommand, PostMessageUsecase} from "../post-message.usecase";
import {Message} from "../message";
import {ViewTimelineUsecase} from "../view-timeline.usecase";

export const createMessagingFixture = () => {
  let timeline: {
    author: string,
    text: string,
    publishedTime: string
  }[];
  const dateProvider = new StubDateProvider();
  const messageRepository = new InMemoryMessageRepository();
  const postMessageUsecase = new PostMessageUsecase(messageRepository, dateProvider);
  const viewTimelineUseCase = new ViewTimelineUsecase(messageRepository, dateProvider);

  let throwError: Error;

  return {
    givenTheFollowingMessagesExist(messages: Message[]) {
      messageRepository.givenExistingMessages(messages);
    },
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
    async whenUserseesTheTimelineOf(user: string) {
      timeline = await viewTimelineUseCase.handle({ user });
    },
    async whenUserEditsMessage(editMEssageCommand: {
      messageId: string,
      text: string
    }) {},
    thenMessageShouldBe(expectedMessage: Message) {
      expect(expectedMessage).toEqual(messageRepository.getMessageById(expectedMessage.id));
    },
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(throwError).toBeInstanceOf(expectedErrorClass);
    },
    thenUserShouldSee(expectedTimeline: {author: string, text: string, publishedTime: string}[]) {
      expect(timeline).toEqual(expectedTimeline);
    }
  }
}

export type MessagingFixture = ReturnType<typeof createMessagingFixture>;
