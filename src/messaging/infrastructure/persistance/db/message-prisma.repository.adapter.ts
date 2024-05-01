import { MessageRepository } from '../../../domain/ports/output/message.repository';
import { MessageEntity } from '../../../domain/entities/message.entity';
import { PrismaClient } from '@prisma/client';

export class MessagePrismaRepositoryAdapter implements MessageRepository {
  constructor(
    private readonly prisma: PrismaClient
  ) {}

  async save(message: MessageEntity): Promise<void> {
    const messageData = message.data;

    await this.prisma.user.upsert({
      where: { name: messageData.author },
      update: { name: messageData.author },
      create: { name: messageData.author },
    });

    await this.prisma.message.upsert({
      where: { id: messageData.id },
      update: {
        id: messageData.id,
        text: messageData.text,
        authorId: messageData.author,
        publishedAt: messageData.publishedAt,
      },
      create: {
        id: messageData.id,
        text: messageData.text,
        authorId: messageData.author,
        publishedAt: messageData.publishedAt,
      },
    });
  }

  async getById(messageId: string): Promise<MessageEntity> {
    const messageData = await this.prisma.message.findFirstOrThrow({
      where: { id: messageId },
    });

    return MessageEntity.fromData({
      id: messageData.id,
      author: messageData.authorId,
      text: messageData.text,
      publishedAt: messageData.publishedAt,
    });
  }

  async getAllOfUser(user: string): Promise<MessageEntity[]> {
    const messagesData = await this.prisma.message.findMany({
      where: { authorId: user },
    });

    return messagesData.map((message) => MessageEntity.fromData({
      id: message.id,
      author: message.authorId,
      text: message.text,
      publishedAt: message.publishedAt,
    }));
  }

}
