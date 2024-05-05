import { MessageRepository } from '../../../../messaging/domain/ports/output/message.repository';
import { FolloweeRepository } from '../../../domain/ports/output/followee.repository';
import { StubDateProvider } from '../../../../messaging/infrastructure/stub-date-provider';
import { ViewWallUsecase } from '../../../application/usecases/view-wall.usecase';
import { DefaultTimelinePresenter } from '../../../application/presenters/timeline.default.presenter';
import { TimelinePresenter } from '../../../application/presenters/timeline.presenter';

export const createWallFixture = ({
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
  );
  const defaultWallPresenter = new DefaultTimelinePresenter(dateProvider);
  const  wallPresenter: TimelinePresenter = {
    show(theWall) {
      wall = defaultWallPresenter.show(theWall);
    }
  }

  return {
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },
    async whenUserSeesTheWallOf(user: string) {
      await viewWallUsecase.handle({user}, wallPresenter);
    },
    thenUserShouldSee(expectedWall: { author: string, text: string, publicationTime: string}[]) {
      expect(wall).toEqual(expectedWall);
    }
  }
}

export type Fixture = ReturnType<typeof createWallFixture>;
