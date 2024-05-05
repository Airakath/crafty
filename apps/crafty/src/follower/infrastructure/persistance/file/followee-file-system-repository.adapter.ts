import {FolloweeRepository} from "../../../domain/ports/output/followeeRepository";
import * as path from "node:path";
import * as fs from 'node:fs';
import { FolloweeEntity } from '../../../domain/entities/followee.entity';

export class FolloweeFileSystemRepositoryAdapter implements FolloweeRepository {
  constructor(
    private readonly followeesPath: string = path.join(__dirname, 'followees-test.json'),
  ) {}

  async saveFollowee(followee: FolloweeEntity): Promise<void> {
    const followees = await this.getFollowees();
    const actualUserFollowees = followees[followee.user] ?? [];
    actualUserFollowees.push(followee.followee);
    followees[followee.user] = actualUserFollowees;

    return fs.promises.writeFile(this.followeesPath, JSON.stringify(followees));
  }

  async getFolloweesOf(user: string): Promise<string[]> {
    const followees = await this.getFollowees();

    return followees[user] ?? [];
  }

  private async getFollowees(): Promise<Record<string, string[]>> {
    const data = await fs.promises.readFile(this.followeesPath);

    return JSON.parse(data.toString()) as { [user: string]: string[]};
  };
}
