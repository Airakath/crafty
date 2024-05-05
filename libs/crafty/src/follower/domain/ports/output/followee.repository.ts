import {FolloweeEntity} from "../../entities/followee.entity";

export interface FolloweeRepository {
  saveFollowee(followee: FolloweeEntity): Promise<void>;
  getFolloweesOf(user: string): Promise<string[]>;
}
