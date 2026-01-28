import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileModule } from './profile/profile.module';
import { FollowController } from './follow/follow.controller';
import { FollowModule } from './follow/follow.module';

@Module({
  imports: [ProfileModule, FollowModule],
  controllers: [AppController, FollowController],
  providers: [AppService],
})
export class AppModule {}
