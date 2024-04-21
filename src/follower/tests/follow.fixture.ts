import {FolloweeEntity} from "../domain/entities/followee.entity";
import {FolloweeMemoryRepositoryAdapter} from "../infrastructure/persistance/memory/followee-memory-repository.adapter";
import {FollowUserUsecase} from "../application/usecases/follow-user.usecase";


export const createFollowFixture = () => {
  const followeeRepository = new FolloweeMemoryRepositoryAdapter()
  const followUserUsecase = new FollowUserUsecase(followeeRepository);

  return {
    givenUserFollower({ user, followees }: { user: string, followees: string[]}){
      followeeRepository.givenExistingFollowees(followees.map((followee) => new FolloweeEntity(user, followee)));
    },
    async whenUserFollows({ user, userToFollow}: { user: string, userToFollow: string}){

    },
    async thenUserFollows(expectedFollow: FolloweeEntity) {
      const follow = await followeeRepository.getFollowByUser(expectedFollow.user);
      expect(follow).toEqual(expectedFollow);
    },
  };
}

export type Fixture = ReturnType<typeof createFollowFixture>;
