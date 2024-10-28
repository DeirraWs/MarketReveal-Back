import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {DatabaseModule} from "../data-base-provider/data-base-provider.module";
import {usersProvider} from "./users.provider";

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService,
      ...usersProvider]
})
export class UsersModule {}
