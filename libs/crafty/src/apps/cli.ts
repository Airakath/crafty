#!/usr/bin/env node
import { PostMessageCommand, PostMessageUsecase } from '../messaging/application/usecases/post-message.usecase';
import { Command } from 'commander';
import { ViewTimelineUsecase } from '../messaging/application/usecases/view-timeline.usecase';
import { EditMessageCommand, EditMessageUsecase } from '../messaging/application/usecases/edit-message.usecase';
import { RealDateProvider } from '../messaging/infrastructure/real-date-provider';
import { FollowUserCommand, FollowUserUsecase } from '../follower/application/usecases/follow-user.usecase';
import { ViewWallUsecase } from '../follower/application/usecases/view-wall.usecase';
import { PrismaClient } from '@prisma/client';
import {
  MessagePrismaRepositoryAdapter
} from '../messaging/infrastructure/persistance/db/message-prisma.repository.adapter';
import {
  FolloweePrismaRepositoryAdapter
} from '../follower/infrastructure/persistance/db/followee-prisma-repository.adapter';
import { TimelinePresenter } from '../follower/application/presenters/timeline.presenter';
import { TimelineEntity } from '../messaging/domain/entities/timeline.entity';
import { DefaultTimelinePresenter } from '../follower/application/presenters/timeline.default.presenter';

class CliTimelinePresenter implements TimelinePresenter {
  constructor(
    private readonly defaultTimelinePresenter: DefaultTimelinePresenter
  ) {}

  show(timeline: TimelineEntity): void {
    console.table(this.defaultTimelinePresenter.show(timeline));
  }
}
const prismaClient = new PrismaClient();
const messageRepository = new MessagePrismaRepositoryAdapter(prismaClient);
const followeeRepository = new FolloweePrismaRepositoryAdapter(prismaClient);
const dateProvider = new RealDateProvider();
const defaultTimelinePresenter = new DefaultTimelinePresenter(dateProvider);
const timelinePresenter = new CliTimelinePresenter(defaultTimelinePresenter);
const postMessageUsecase = new PostMessageUsecase(messageRepository, dateProvider);
const editMessageUsecase = new EditMessageUsecase(messageRepository);
const followUserUsecase = new FollowUserUsecase(followeeRepository);
const viewTimelineUsecase = new ViewTimelineUsecase(messageRepository);
const viewWallUsecase = new ViewWallUsecase(messageRepository, followeeRepository);

const program = new Command();

program
  .version('1.0.0')
  .description('Crafty social network')
  .addCommand(new Command('post')
    .argument('<user>', 'the current user')
    .argument('<message>', 'the message to post')
    .action(async (user, message) => {
      const postMessageCommand: PostMessageCommand = {
        id: `${Math.floor(Math.random() * 10000)}`,
        author: user,
        text: message,
      };
      try {
        const result = await postMessageUsecase.handle(postMessageCommand);
        if (result.isOk()) {
          console.log('MessageEntity posted');
          process.exit(0);
        }

        console.error(result.error);
        process.exit(1);

      } catch (err) {
        console.error(err);
        process.exit(1);
      }
    }),
  )
  .addCommand(new Command('edit')
    .argument('<message-id>', 'the message id of the message to edit')
    .argument('<message>', 'the new text')
    .action(async (messageId, message) => {
      const editMessageCommand: EditMessageCommand = {
        messageId,
        text: message,
      };
      try {
        const result = await editMessageUsecase.handle(editMessageCommand);
        if (result.isOk()) {
          console.log('MessageEntity edited');
          process.exit(0);
        }

        console.error(result.error);
        process.exit(1);

      } catch (err) {
        console.error(err);
        process.exit(1);
      }
    }),
  )
  .addCommand(new Command('follow')
    .argument('<user>', 'the current user')
    .argument('<user-to-follow>', 'the user to follow')
    .action(async (user, userToFollow) => {
      const followUserCommand: FollowUserCommand = {
        user,
        userToFollow,
      };
      try {
        await followUserUsecase.handle(followUserCommand);
        console.log(`${user} is now following ${userToFollow}`);
      } catch (err) {
        console.error(err);
      }
    }),
  )
  .addCommand(
    new Command('view')
      .argument('<user>', 'the user to view the timeline of')
      .action(async (user) => {
        try {
          const timeline = await viewTimelineUsecase.handle({user}, timelinePresenter);
          process.exit(0);
        } catch (err) {
          console.error(err);
          process.exit(1);
        }
      }),
  ).addCommand(
  new Command('wall')
    .argument('<user>', 'the user to view the wall of')
    .action(async (user) => {
      try {
        const timeline = await viewWallUsecase.handle({user}, timelinePresenter);
        process.exit(0);
      } catch (err) {
        console.error(err);
        process.exit(1);
      }
    }),
);


async function main() {
  await prismaClient.$connect();
  await program.parseAsync();
  await prismaClient.$disconnect();
}

main();
