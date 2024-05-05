import {FolloweeEntity} from "../../../domain/entities/followee.entity";
import {FolloweeMemoryRepositoryAdapter} from "../../../infrastructure/persistance/memory/followee-memory-repository.adapter";
import {FollowUserCommand, FollowUserUsecase} from "../../../application/usecases/follow-user.usecase";


export const createFollowingFixture = () => {
  const followeeRepository = new FolloweeMemoryRepositoryAdapter()
  const followUserUsecase = new FollowUserUsecase(followeeRepository);

  return {
    givenUserFollowees({ user, followees }: { user: string, followees: string[]}){
      followeeRepository.givenExistingFollowees(followees.map((followee) => new FolloweeEntity(user, followee)));
    },
    async whenUserFollows(followUserCommand: FollowUserCommand){
      await followUserUsecase.handle(followUserCommand);
    },
    async thenUserFollowsAre(userFollowees: { user: string, followees: string[] }) {
      const actualFollowees = await followeeRepository.getFolloweesOf(userFollowees.user);
      expect(actualFollowees).toEqual(userFollowees.followees);
    },
    followeeRepository,
  };
}

export type FollowingFixture = ReturnType<typeof createFollowingFixture>;
