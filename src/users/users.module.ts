import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UsersService, DatabaseService, JwtService],
  controllers: [UsersController],
})
export class UsersModule {}
