import { DynamicModule, Module } from '@nestjs/common';
import { PostMessageUsecase } from '@crafty/crafty/messaging/application/usecases/post-message.usecase';
import { EditMessageUsecase } from '@crafty/crafty/messaging/application/usecases/edit-message.usecase';
import { FollowUserUsecase } from '@crafty/crafty/follower/application/usecases/follow-user.usecase';
import { ViewTimelineUsecase } from '@crafty/crafty/messaging/application/usecases/view-timeline.usecase';
import { ViewWallUsecase } from '@crafty/crafty/follower/application/usecases/view-wall.usecase';
import { DefaultTimelinePresenter } from '@crafty/crafty/follower/application/presenters/timeline.default.presenter';
import { IMessageRepository } from '@crafty/crafty/messaging/domain/ports/output/message.repository';
import {
  InMemoryMessageRepository
} from '@crafty/crafty/messaging/infrastructure/persistance/memory/message-inmemory.repository';

@Module({
  providers: [],
  exports: [],
})
export class CraftyModule {
  static register(): DynamicModule {
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
          provide: IMessageRepository,
          useClass: InMemoryMessageRepository,
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
