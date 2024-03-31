#!/usr/bin/env node
import {DateProvider, PostMessageCommand, PostMessageUsecase} from "./src/post-message.usecase";
import {InMemoryMessageRepository} from "./src/message-inmemory.repository";
import { Command } from "commander";
import {FileSystemMessageRepository} from "./src/message-fr.repository";

class RealDateProvider implements DateProvider{
  getNow(): Date {
    return new Date();
  }
}

const messageRepository = new FileSystemMessageRepository();
const dateProvider = new RealDateProvider();
const postMessageUsecase = new PostMessageUsecase(messageRepository, dateProvider);

const program = new Command();

program
  .version('1.0.0')
  .description('Crafty social network')
  .addCommand(new Command('post')
    .argument('<user>', 'the current user')
    .argument('<message>','the message to post')
    .action(async (user, message) => {
      const postMessageCommand: PostMessageCommand = {
        id: 'some-message-id',
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
  );


async function main() {
  await program.parseAsync();
}

main();
