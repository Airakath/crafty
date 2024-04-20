#!/usr/bin/env node
import {DateProvider, PostMessageCommand, PostMessageUsecase} from "./src/post-message.usecase";
import { Command } from "commander";
import {FileSystemMessageRepository} from "./src/message-fs.repository";
import {ViewTimelineUsecase} from "./src/view-timeline.usecase";
import {EditMessageCommand, EditMessageUsecase} from "./src/edit-message.usecase";

class RealDateProvider implements DateProvider{
  getNow(): Date {
    return new Date();
  }
}

const messageRepository = new FileSystemMessageRepository();
const dateProvider = new RealDateProvider();
const postMessageUsecase = new PostMessageUsecase(messageRepository, dateProvider);
const editMessageUsecase = new EditMessageUsecase(messageRepository);

const viewTimelineUsecase = new ViewTimelineUsecase(messageRepository, dateProvider);

const program = new Command();

program
  .version('1.0.0')
  .description('Crafty social network')
  .addCommand(new Command('post')
    .argument('<user>', 'the current user')
    .argument('<message>','the message to post')
    .action(async (user, message) => {
      const postMessageCommand: PostMessageCommand = {
        id: `${Math.floor(Math.random() * 10000)}`,
        author: user,
        text: message,
      }
      try {
        await postMessageUsecase.handle(postMessageCommand);
        console.log("Message posted");
        //console.table([messageRepository.message]);
      } catch (err) {
        console.error(err);
      }
    })
  )
  .addCommand(new Command('edit')
    .argument('<message-id>','the message id of the message to edit')
    .argument('<message>','the new text')
    .action(async (messageId, message) => {
      const editMessageCommand: EditMessageCommand = {
        messageId,
        text: message,
      }
      try {
        await editMessageUsecase.handle(editMessageCommand);
        console.log("Message edited");
      } catch (err) {
        console.error(err);
      }
    })
  )
  .addCommand(
    new Command('view')
      .argument("<user>", "the user to view the timeline of")
      .action(async (user) => {
        try {
          const timeline = await viewTimelineUsecase.handle({ user });
          console.table(timeline);
          process.exit(0);
        } catch (err) {
          console.error(err);
          process.exit(1);
        }
      })
  );


async function main() {
  await program.parseAsync();
}

main();
