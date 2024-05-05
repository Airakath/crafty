import { FolloweeRepository } from '../../../domain/ports/output/followeeRepository';
import { FolloweeEntity } from '../../../domain/entities/followee.entity';
import { PrismaClient } from '@prisma/client';

export class FolloweePrismaRepositoryAdapter implements FolloweeRepository {

  constructor(
    private readonly prisma: PrismaClient
  ) {}

  async saveFollowee(followee: FolloweeEntity): Promise<void> {
    await this.upsertUser(followee.user);
    await this.upsertUser(followee.followee);
    await this.prisma.user.update({
      where: { name: followee.user },
      data: {
        following: {
          connectOrCreate: [
            {
              where: { name: followee.followee },
              create: { name: followee.followee },
            },
          ],
        },
      },
    });
  }

  async getFolloweesOf(user: string): Promise<string[]> {
    const theUser = await this.prisma.user.findFirstOrThrow({
      where: { name: user },
      include: { following: true },
    });

    return theUser.following.map((followee) => followee.name);
  }

  private async upsertUser(user: string): Promise<void> {
    await this.prisma.user.upsert({
      where: { name: user },
      update: { name: user },
      create: { name: user },
    });
  }
}
