import {FolloweeRepository} from "../../domain/ports/output/followeeRepository";
import {FolloweeEntity} from "../../domain/entities/followee.entity";

export type FollowUserCommand = {
  user: string;
  userTofollow: string;
};

export class FollowUserUsecase {

  constructor(
    private readonly followeeRepository: FolloweeRepository
  ) {}
  async handle(followUserCommand: FollowUserCommand) {
    return this.followeeRepository.saveFollowee(FolloweeEntity.fromData({
      user: followUserCommand.user,
      followee: followUserCommand.userTofollow
    }));
  }
}
