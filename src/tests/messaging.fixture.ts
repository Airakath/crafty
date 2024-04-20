import {StubDateProvider} from "../stub-date-provider";
import {InMemoryMessageRepository} from "../message-inmemory.repository";
import {PostMessageCommand, PostMessageUsecase} from "../post-message.usecase";
import {Message} from "../message";
import {ViewTimelineUsecase} from "../view-timeline.usecase";
import {EditMessageCommand, EditMessageUsecase} from "../edit-message.usecase";

export const createMessagingFixture = () => {
  let timeline: {
    author: string,
    text: string,
    publishedTime: string
  }[];
  const dateProvider = new StubDateProvider();
  const messageRepository = new InMemoryMessageRepository();
  const postMessageUsecase = new PostMessageUsecase(messageRepository, dateProvider);
  const editMessageUsecase = new EditMessageUsecase(messageRepository);
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
    async whenUserEditsMessage(editMessageCommand: EditMessageCommand) {
      try {
        await editMessageUsecase.handle(editMessageCommand);
      } catch (err) {
        throwError = err;
      }
    },
    async whenUserSeesTheTimelineOf(user: string) {
      timeline = await viewTimelineUseCase.handle({ user });
    },
    async thenMessageShouldBe(expectedMessage: Message) {
      const message = await messageRepository.getById(expectedMessage.id);
      expect(message).toEqual(expectedMessage);
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
