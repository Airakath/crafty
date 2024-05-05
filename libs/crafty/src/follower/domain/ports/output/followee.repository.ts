import {FolloweeEntity} from "../../entities/followee.entity";
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class FolloweeRepository {
  abstract saveFollowee(followee: FolloweeEntity): Promise<void>;
  abstract getFolloweesOf(user: string): Promise<string[]>;
}
