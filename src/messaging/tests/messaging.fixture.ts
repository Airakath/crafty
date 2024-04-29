import {StubDateProvider} from "../infrastructure/stub-date-provider";
import {InMemoryMessageRepository} from "../infrastructure/persistance/memory/message-inmemory.repository";
import {PostMessageCommand, PostMessageUsecase} from "../application/usecases/post-message.usecase";
import {ViewTimelineUsecase} from "../application/usecases/view-timeline.usecase";
import {EditMessageCommand, EditMessageUsecase} from "../application/usecases/edit-message.usecase";
import {MessageEntity} from "../domain/entities/message.entity";

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
    givenTheFollowingMessagesExist(messages: MessageEntity[]) {
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
    async thenMessageShouldBe(expectedMessage: MessageEntity) {
      const message = await messageRepository.getById(expectedMessage.id);
      expect(message).toEqual(expectedMessage);
    },
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(throwError).toBeInstanceOf(expectedErrorClass);
    },
    thenUserShouldSee(expectedTimeline: {author: string, text: string, publishedTime: string}[]) {
      expect(timeline).toEqual(expectedTimeline);
    },
    messageRepository,
  }
}

export type MessagingFixture = ReturnType<typeof createMessagingFixture>;
