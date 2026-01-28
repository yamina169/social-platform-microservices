import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from './blog/blog.module';
import { UploadModule } from './upload/upload.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [BlogModule, UploadModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
