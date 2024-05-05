import { ClassProvider, DynamicModule, Module } from '@nestjs/common';
import { PostMessageUsecase } from '@crafty/crafty/messaging/application/usecases/post-message.usecase';
import { EditMessageUsecase } from '@crafty/crafty/messaging/application/usecases/edit-message.usecase';
import { FollowUserUsecase } from '@crafty/crafty/follower/application/usecases/follow-user.usecase';
import { ViewTimelineUsecase } from '@crafty/crafty/messaging/application/usecases/view-timeline.usecase';
import { ViewWallUsecase } from '@crafty/crafty/follower/application/usecases/view-wall.usecase';
import { DefaultTimelinePresenter } from '@crafty/crafty/follower/application/presenters/timeline.default.presenter';
import { MessageRepository } from '@crafty/crafty/messaging/domain/ports/output/message.repository';
import { FolloweeRepository } from '@crafty/crafty/follower/domain/ports/output/followee.repository';
import { DateProvider } from '@crafty/crafty/messaging/application/date-provider';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [],
  exports: [],
})
export class CraftyModule {
  static register(providers: {
    MessageRepository: ClassProvider<MessageRepository>
    ['useClass'];
    FolloweeRepository: ClassProvider<FolloweeRepository>
    ['useClass'];
    DateProvider: ClassProvider<DateProvider>
    ['useClass'];
    PrismaClient: ClassProvider<PrismaClient>
    ['useClass'];
  }): DynamicModule {
    return {
      module: CraftyModule,
      providers: [
        PostMessageUsecase,
        EditMessageUsecase,
        FollowUserUsecase,
        ViewTimelineUsecase,
        ViewWallUsecase,
        DefaultTimelinePresenter,
        {
          provide: MessageRepository,
          useClass: providers.MessageRepository,
        },
        {
          provide: FolloweeRepository,
          useClass: providers.FolloweeRepository,
        },
        {
          provide: DateProvider,
          useClass: providers.DateProvider,
        },
        {
          provide: PrismaClient,
          useClass: providers.PrismaClient,
        }
      ],
      exports: [
        PostMessageUsecase,
        EditMessageUsecase,
        FollowUserUsecase,
        ViewTimelineUsecase,
        ViewWallUsecase,
        DefaultTimelinePresenter,
      ],
    };
  }
}
