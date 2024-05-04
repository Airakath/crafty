import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { PrismaClient } from '@prisma/client';
import { promisify } from 'node:util';
import { exec } from 'node:child_process';
import { messageBuilder } from '../message.builder';
import { MessagePrismaRepositoryAdapter } from '../../infrastructure/persistance/db/message-prisma.repository.adapter';

const asyncExec = promisify(exec);

describe('PrismaMessageRepository', () => {
  let container: StartedPostgreSqlContainer;
  let prismaClient: PrismaClient;

  const DATABASE = 'crafty-test';
  const USER = 'crafty';
  const PASSWORD = 'sectret';
  const PORT = 5430;

  beforeAll(async () => {
    container = await new PostgreSqlContainer()
      .withDatabase(DATABASE)
      .withUsername(USER)
      .withPassword(PASSWORD)
      .withExposedPorts({
        container: PORT,
        host: PORT,
      })
      .start()

    prismaClient = new PrismaClient({
      datasourceUrl: container.getConnectionUri(),
    });

    await asyncExec(`set DATABASE_URL=${container.getConnectionUri()} && npx prisma migrate deploy`); //for windows
    //await asyncExec(`DATABASE_URL=${container.getConnectionUri()} npx prisma migrate deploy`); //for linux

    return prismaClient.$connect();
  }, 10000);

  afterAll(async () => {
    await container.stop({ timeout: 1000 });
    return prismaClient.$disconnect();
  });

  beforeEach(async () => {
    await prismaClient.message.deleteMany();
    await prismaClient.$executeRawUnsafe('DELETE FROM "User" CASCADE');
  });

  test('save() should save a new message', async () => {
    const messageRepository = new MessagePrismaRepositoryAdapter(prismaClient);
    await messageRepository.save(
      messageBuilder()
        .authoredBy('Alice')
        .withId('message-id')
        .withText('Hello World!')
        .publishedAt(new Date('2023-01-19T19:00:00.000Z'))
        .build()
    );

    const expectedMessage = await prismaClient.message.findUnique({
      where: { id: 'message-id' },
    });

    expect(expectedMessage).toEqual({
      id: 'message-id',
      authorId: 'Alice',
      publishedAt: new Date("2023-01-19T19:00:00.000Z"),
      text: 'Hello World!',
    });
  });

  test('save() should update an existing message', async () => {
    const messageRepository = new MessagePrismaRepositoryAdapter(prismaClient);

    const aliceMessage = messageBuilder()
      .authoredBy('Alice')
      .withId('message-id')
      .withText('Hello World !')
      .publishedAt(new Date('2023-01-19T19:00:00.000Z'))


    await messageRepository.save(
      aliceMessage
        .build()
    );

    await messageRepository.save(
      aliceMessage
        .withText('Hello World !!!')
        .build()
    );

    const expectedMessage = await prismaClient.message.findUnique({
      where: { id: 'message-id' },
    });

    expect(expectedMessage).toEqual({
      id: 'message-id',
      authorId: 'Alice',
      publishedAt: new Date("2023-01-19T19:00:00.000Z"),
      text: 'Hello World !!!',
    });
  });

  test('getById() should return a message by its id', async () => {
    const messageRepository = new MessagePrismaRepositoryAdapter(prismaClient);

    const aliceMessage = messageBuilder()
      .authoredBy('Alice')
      .withId('message-id')
      .withText('Hello World !!!')
      .publishedAt(new Date('2023-01-19T19:00:00.000Z'))
      .build();

    await messageRepository.save(aliceMessage);

    const retrievedwMessage = await messageRepository.getById('message-id');

    expect(retrievedwMessage).toEqual(
      messageBuilder()
        .authoredBy('Alice')
        .withId('message-id')
        .withText('Hello World !!!')
        .publishedAt(new Date('2023-01-19T19:00:00.000Z'))
        .build());
  });

  test('getAllOfUser() should return all user messages', async () => {
    const messageRepository = new MessagePrismaRepositoryAdapter(prismaClient);

    await Promise.all([
      messageRepository.save(
        messageBuilder()
          .authoredBy('Alice')
          .withId('message-id-1')
          .withText('Hello World !!!')
          .publishedAt(new Date('2023-01-19T19:00:00.000Z'))
          .build()),
      messageRepository.save(
        messageBuilder()
          .authoredBy('Bob')
          .withId('message-id-2')
          .withText('Hello World !')
          .publishedAt(new Date('2023-01-19T19:00:00.000Z'))
          .build()),
      messageRepository.save(
        messageBuilder()
          .authoredBy('Alice')
          .withId('message-id-3')
          .withText('Hello World !')
          .publishedAt(new Date('2023-01-19T19:00:00.000Z'))
          .build()),
      ]);

    const retrievedAliceMessages = await messageRepository.getAllOfUser('Alice');

    expect(retrievedAliceMessages).toHaveLength(2);
    expect(retrievedAliceMessages).toEqual(expect.arrayContaining([
      messageBuilder()
        .authoredBy('Alice')
        .withId('message-id-1')
        .withText('Hello World !!!')
        .publishedAt(new Date('2023-01-19T19:00:00.000Z'))
        .build(),
      messageBuilder()
        .authoredBy('Alice')
        .withId('message-id-3')
        .withText('Hello World !')
        .publishedAt(new Date('2023-01-19T19:00:00.000Z'))
        .build()
    ]));
  });

});
