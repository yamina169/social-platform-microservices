import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@/user/user.module';
import config from './ormconfig'; // your TypeORM config file

@Module({
  imports: [
    TypeOrmModule.forRoot(config), // connects to your DB
    ConfigModule.forRoot({
      isGlobal: true, // makes environment variables available globally
    }),
    UserModule, // only keep UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
