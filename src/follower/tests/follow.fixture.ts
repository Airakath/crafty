import {FolloweeEntity} from "../domain/entities/followee.entity";
import {FolloweeMemoryRepositoryAdapter} from "../infrastructure/persistance/memory/followee-memory-repository.adapter";
import {FollowUserCommand, FollowUserUsecase} from "../application/usecases/follow-user.usecase";


export const createFollowFixture = () => {
  const followeeRepository = new FolloweeMemoryRepositoryAdapter()
  const followUserUsecase = new FollowUserUsecase(followeeRepository);

  return {
    givenUserFollower({ user, followees }: { user: string, followees: string[]}){
      followeeRepository.givenExistingFollowees(followees.map((followee) => new FolloweeEntity(user, followee)));
    },
    async whenUserFollows(followUserCommand: FollowUserCommand){
      await followUserUsecase.handle(followUserCommand);
    },
    async thenUserFollowsAre(userFollowees: { user: string, followees: string[] }) {
      const actualFollowees = await followeeRepository.getFolloweesOf(userFollowees.user);
      expect(actualFollowees).toEqual(userFollowees.followees);
    },
  };
}

export type Fixture = ReturnType<typeof createFollowFixture>;
