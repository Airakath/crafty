import { MessageRepository } from '../../../../messaging/domain/ports/output/message.repository';
import { FolloweeRepository } from '../../../domain/ports/output/followeeRepository';
import { StubDateProvider } from '../../../../messaging/infrastructure/stub-date-provider';
import { ViewWallUsecase } from '../../../application/usecases/view-wall.usecase';

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
    dateProvider
  );
  return {
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },
    async whenUserSeesTheWallOf(user: string) {
      wall = await viewWallUsecase.handle({user});
    },
    thenUserShouldSee(expectedWall: { author: string, text: string, publicationTime: string}[]) {
      expect(wall).toEqual(expectedWall);
    }
  }
}

export type Fixture = ReturnType<typeof createWallFixture>;
