import {FolloweeRepository} from "../../../domain/ports/output/followeeRepository";
import {FolloweeEntity} from "../../../domain/entities/followee.entity";

export class FolloweeMemoryRepositoryAdapter implements FolloweeRepository {

  followeesByUser = new Map<string, string[]>();

  async saveFollowee(followee: FolloweeEntity): Promise<void> {
    this.addFollowee((followee));

    return Promise.resolve();
  }
  getFollowByUser(user: string): Promise<FolloweeEntity> {
    throw new Error("Method not implemented.");
  }

  givenExistingFollowees(followees: FolloweeEntity[]) {
    followees.forEach((followee) => this.addFollowee(followee));
  }

  private addFollowee(followee: FolloweeEntity) {
    const existingFollowees = this.followeesByUser.get(followee.user) ?? [];
    existingFollowees.push(followee.followee);
    this.followeesByUser.set(followee.user, existingFollowees);
  }
}
