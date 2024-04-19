import * as path from "node:path";
import * as fs from "node:fs";
import {MessageRepository} from "./message.repository";
import {Message} from "./message";

export class FileSystemMessageRepository implements MessageRepository {
  private readonly messagePath = path.join(__dirname, 'messages.json');
   async save(message: Message): Promise<void>{
     const messages = await this.getMessages();
     messages.push(message);

     return fs.promises.writeFile(
       this.messagePath,
       JSON.stringify(messages)
     );
  }

  private async getMessages(): Promise<Message[]> {
     const data = await fs.promises.readFile(this.messagePath);
     const messages = JSON.parse(data.toString()) as {
       id: string;
       author: string;
       text: string;
       publishedAt: string;
     }[];

     return messages.map(msg => ({
       id: msg.id,
       author: msg.author,
       text: msg.text,
       publishedAt: new Date(msg.publishedAt),
     }));
  }

  async getAllOfUser(user: string): Promise<Message[]> {
    const messages = await this.getMessages();

    return messages.filter((msg) => msg.author === user);
  }
}
