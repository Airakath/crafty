import {FolloweeRepository} from "../../../domain/ports/output/followeeRepository";
import {FolloweeEntity} from "../../../domain/entities/followee.entity";

export class FolloweeFileSystemRepositoryAdapter implements FolloweeRepository {
  saveFollowee(followee: FolloweeEntity): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getFollowByUser(user: string): Promise<FolloweeEntity> {
    throw new Error("Method not implemented.");
  }
}
