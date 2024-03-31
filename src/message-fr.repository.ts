import {Message, MessageRepository} from "./post-message.usecase";
import * as path from "node:path";
import * as fs from "node:fs";

export class FileSystemMessageRepository implements MessageRepository {
   save(message: Message): Promise<void>{
    return fs.promises.writeFile(
      path.join(__dirname, 'messages.json'),
      JSON.stringify(message)
    );
  }
}
