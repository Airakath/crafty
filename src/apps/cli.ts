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

const prismaClient = new PrismaClient();
const messageRepository = new MessagePrismaRepositoryAdapter(prismaClient);
const followeeRepository = new FolloweePrismaRepositoryAdapter(prismaClient);
const dateProvider = new RealDateProvider();
const postMessageUsecase = new PostMessageUsecase(messageRepository, dateProvider);
const editMessageUsecase = new EditMessageUsecase(messageRepository);
const followUserUsecase = new FollowUserUsecase(followeeRepository);
const viewTimelineUsecase = new ViewTimelineUsecase(messageRepository, dateProvider);
const viewWallUsecase = new ViewWallUsecase(messageRepository, followeeRepository, dateProvider);

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
        await postMessageUsecase.handle(postMessageCommand);
        console.log('MessageEntity posted');
        //console.table([messageRepository.message]);
      } catch (err) {
        console.error(err);
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
        await editMessageUsecase.handle(editMessageCommand);
        console.log('MessageEntity edited');
      } catch (err) {
        console.error(err);
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
          const timeline = await viewTimelineUsecase.handle({user});
          console.table(timeline);
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
        const timeline = await viewWallUsecase.handle({user});
        console.table(timeline);
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
