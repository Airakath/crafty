import { PostMessageCommand, PostMessageUsecase } from '../messaging/application/usecases/post-message.usecase';
import { ViewTimelineUsecase } from '../messaging/application/usecases/view-timeline.usecase';
import { RealDateProvider } from '../messaging/infrastructure/real-date-provider';
import { FollowUserCommand, FollowUserUsecase } from '../follower/application/usecases/follow-user.usecase';
import { ViewWallUsecase } from '../follower/application/usecases/view-wall.usecase';
import { PrismaClient } from '@prisma/client';
import {
  MessagePrismaRepositoryAdapter,
} from '../messaging/infrastructure/persistance/db/message-prisma.repository.adapter';
import {
  FolloweePrismaRepositoryAdapter,
} from '../follower/infrastructure/persistance/db/followee-prisma-repository.adapter';
import { EditMessageCommand, EditMessageUsecase } from '../messaging/application/usecases/edit-message.usecase';
import express, { Request, Response } from 'express';
import morgan from 'morgan';


const prismaClient = new PrismaClient();
const messageRepository = new MessagePrismaRepositoryAdapter(prismaClient);
const followeeRepository = new FolloweePrismaRepositoryAdapter(prismaClient);
const dateProvider = new RealDateProvider();
const postMessageUsecase = new PostMessageUsecase(messageRepository, dateProvider);
const editMessageUsecase = new EditMessageUsecase(messageRepository);
const followUserUsecase = new FollowUserUsecase(followeeRepository);
const viewTimelineUsecase = new ViewTimelineUsecase(messageRepository, dateProvider);
const viewWallUsecase = new ViewWallUsecase(messageRepository, followeeRepository, dateProvider);

const PORT = 3000;
const NODE_ENV = 'development';
const FORMAT_LOGS = 'dev';

const app = express();

app.use(express.urlencoded({extended: true})); 	// for parsing application/x-www-form-urlencoded
app.use(express.json()); 							// for parsing application/json
app.use(morgan(FORMAT_LOGS));


app.post('/post', async (req: Request<{user: string, message: string }>, res: Response) => {
  const postMessageCommand: PostMessageCommand = {
    id: `${Math.floor(Math.random() * 10000)}`,
    author: req.body.user,
    text: req.body.message,
  };

  try {
    await postMessageUsecase.handle(postMessageCommand);
    return res.status(201).send();
  } catch (err) {
    return res.status(400).send(err);
  }
});


app.post('/edit',async (req: Request<{messageId: string; message: string }>, res: Response) => {
  const editMessageCommand: EditMessageCommand = {
    messageId: req.body.messageId,
    text: req.body.message,
  };
  try {
    await editMessageUsecase.handle(editMessageCommand);
    return res.status(200).send();
  } catch (err) {
    return res.status(400).send(err);
  }
});

app.post('/follow', async (req: Request<{ user: string; followee: string }>, res: Response) => {
  const followUserCommand: FollowUserCommand = {
    user: req.body.user,
    userToFollow: req.body.followee,
  };
  try {
    await followUserUsecase.handle(followUserCommand);
    return res.status(201).send();
  } catch (err) {
    return res.status(400).send(err);
  }
});

app.get('/view/:user', async (req: Request<{ user: string }>, res: Response) => {
  try {
    const timeline = await viewTimelineUsecase.handle({ user: req.params.user });
    return res.status(200).send(timeline);
  } catch (err) {
    return res.status(400).send(err);
  }
});

app.get('/wall/:user', async (req: Request<{ user: string }>, res: Response) => {
  try {
    const wall = await viewWallUsecase.handle({ user: req.params.user });
    return res.status(200).send(wall);
  } catch (err) {
    return res.status(400).send(err);
  }
});

async function main() {
  try {
    await prismaClient.$connect();

    await app.listen(PORT, () => {
      console.info(`⚡ listening on port ${PORT} in ${NODE_ENV} mode ⚡`);
    }).on('close', async () => {
      await prismaClient.$disconnect();
    });

  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

main();
