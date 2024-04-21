import {FolloweeEntity} from "../../entities/followee.entity";

export interface FolloweeRepository {
  saveFollowee(followee: FolloweeEntity): Promise<void>;
  getFollowByUser(user: string): Promise<FolloweeEntity>;
}
