import {StubDateProvider} from "../../../infrastructure/stub-date-provider";
import {InMemoryMessageRepository} from "../../../infrastructure/persistance/memory/message-inmemory.repository";
import {PostMessageCommand, PostMessageUsecase} from "../../../application/usecases/post-message.usecase";
import {ViewTimelineUsecase} from "../../../application/usecases/view-timeline.usecase";
import {EditMessageCommand, EditMessageUsecase} from "../../../application/usecases/edit-message.usecase";
import {MessageEntity} from "../../../domain/entities/message.entity";
import { DefaultTimelinePresenter } from '../../../../follower/application/presenters/timeline.default.presenter';
import { TimelinePresenter } from '../../../../follower/application/presenters/timeline.presenter';

export const createMessagingFixture = () => {
  let timeline: {
    author: string,
    text: string,
    publicationTime: string
  }[];
  const dateProvider = new StubDateProvider();
  const messageRepository = new InMemoryMessageRepository();
  const postMessageUsecase = new PostMessageUsecase(messageRepository, dateProvider);
  const editMessageUsecase = new EditMessageUsecase(messageRepository);
  const viewTimelineUseCase = new ViewTimelineUsecase(messageRepository);
  const defaultTimelinePresenter = new DefaultTimelinePresenter(dateProvider);
  const  timelinePresenter: TimelinePresenter = {
    show(theTimeline) {
      timeline = defaultTimelinePresenter.show(theTimeline);
    }
  }

  let throwError: Error;

  return {
    givenTheFollowingMessagesExist(messages: MessageEntity[]) {
      messageRepository.givenExistingMessages(messages);
    },
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },
    async whenUserPostsAMessage(postMessageCommand: PostMessageCommand) {
      const result = await postMessageUsecase.handle(postMessageCommand);
      if (result.isErr()) {
        throwError = result.error;
      }
    },
    async whenUserEditsMessage(editMessageCommand: EditMessageCommand) {
      const result = await editMessageUsecase.handle(editMessageCommand);
      if (result.isErr()) {
        throwError = result.error;
      }
     },
    async whenUserSeesTheTimelineOf(user: string) {
     await viewTimelineUseCase.handle({ user }, timelinePresenter);
    },
    async thenMessageShouldBe(expectedMessage: MessageEntity) {
      const message = await messageRepository.getById(expectedMessage.id);
      expect(message).toEqual(expectedMessage);
    },
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(throwError).toBeInstanceOf(expectedErrorClass);
    },
    thenUserShouldSee(expectedTimeline: {author: string, text: string, publicationTime: string}[]) {
      expect(timeline).toEqual(expectedTimeline);
    },
    messageRepository,
  }
}

export type MessagingFixture = ReturnType<typeof createMessagingFixture>;
