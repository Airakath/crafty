import * as path from "node:path";
import * as fs from "node:fs";

import {FileSystemMessageRepositoryAdapter} from "../../infrastructure/persistance/file/./message-fs.repository.adapter";
import {messageBuilder} from "../message.builder";

const testMessagesPath = path.join(__dirname, 'messages-test.json')

describe('FileSystemMessageRepository', () => {

  beforeEach(async () => {
    await fs.promises.writeFile(testMessagesPath, JSON.stringify([]));
  });

  test("save() can save a message in the filesystem", async () => {
    const messageRepository = new FileSystemMessageRepositoryAdapter(testMessagesPath);

    const messageAlice = messageBuilder()
      .withId('message-id')
      .authoredBy('Alice')
      .withText('Hello World')
      .publishedAt(new Date('2023-01-19T19:00:00.000Z'))
      .build();

    await messageRepository.save(messageAlice);

    const messagesData = await fs.promises.readFile(testMessagesPath);
    const messagesJSON = JSON.parse(messagesData.toString());
    expect(messagesJSON).toEqual([
      {
        id: 'message-id',
        author: 'Alice',
        text: 'Hello World',
        publishedAt: '2023-01-19T19:00:00.000Z',
      }
    ]);
  });

  test("save() can update an existing message in the filesystem", async () => {
    const messageRepository = new FileSystemMessageRepositoryAdapter(testMessagesPath);

    await fs.promises.writeFile(testMessagesPath, JSON.stringify([
      {
        id: 'message-id',
        author: 'Alice',
        text: 'Hello World',
        publishedAt: '2023-01-19T19:00:00.000Z',
      }
    ]));

    const messageAlice = messageBuilder()
      .withId('message-id')
      .authoredBy('Alice')
      .withText('Hello World edited')
      .publishedAt(new Date('2023-01-19T19:00:00.000Z'))
      .build();

    await messageRepository.save(messageAlice);

    const messagesData = await fs.promises.readFile(testMessagesPath);
    const messagesJSON = JSON.parse(messagesData.toString());
    expect(messagesJSON).toEqual([
      {
        id: 'message-id',
        author: 'Alice',
        text: 'Hello World edited',
        publishedAt: '2023-01-19T19:00:00.000Z',
      }
    ]);
  });

  test("getById() returns a message by its id", async () => {
    const messageRepository = new FileSystemMessageRepositoryAdapter(testMessagesPath);
    await fs.promises.writeFile(testMessagesPath, JSON.stringify([
      {
        id: 'message-id',
        author: 'Alice',
        text: 'Hello World',
        publishedAt: '2023-01-19T19:00:00.000Z',
      },
      {
        id: 'message-id-2',
        author: 'Bob',
        text: 'Hello World from bob',
        publishedAt: '2023-01-19T19:01:00.000Z',
      }
    ]));

    const bobMessage = await messageRepository.getById('message-id-2');

    expect(bobMessage).toEqual(messageBuilder()
      .withId('message-id-2')
      .authoredBy('Bob')
      .withText('Hello World from bob')
      .publishedAt(new Date('2023-01-19T19:01:00.000Z'))
      .build());
  });

  test("getAllOfUser() returns all the messages of specific user", async () => {
    const messageRepository = new FileSystemMessageRepositoryAdapter(testMessagesPath);
    await fs.promises.writeFile(testMessagesPath, JSON.stringify([
      {
        id: 'message-id',
        author: 'Alice',
        text: 'Hello World',
        publishedAt: '2023-01-19T19:00:00.000Z',
      },
      {
        id: 'message-id-2',
        author: 'Bob',
        text: 'Hello World from bob',
        publishedAt: '2023-01-19T19:01:00.000Z',
      },
      {
        id: 'message-id-3',
        author: 'Bob',
        text: 'Hello World 2 from bob ',
        publishedAt: '2023-01-19T19:02:00.000Z',
      }
    ]));

    const bobMessages = await messageRepository.getAllOfUser('Bob');

    expect(bobMessages).toHaveLength(2);
    expect(bobMessages).toEqual(expect.arrayContaining([
      messageBuilder()
        .withId('message-id-2')
        .authoredBy('Bob')
        .withText('Hello World from bob')
        .publishedAt(new Date('2023-01-19T19:01:00.000Z'))
        .build(),
      messageBuilder()
        .withId('message-id-3')
        .authoredBy('Bob')
        .withText('Hello World 2 from bob ')
        .publishedAt(new Date('2023-01-19T19:02:00.000Z'))
        .build()
    ]));
  });
});
