import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseServices: DatabaseService) {}

  async findUsers(user: User) {
    if (user.role === 'ADMIN') {
      return await this.databaseServices.user.findMany();
    }

    return await this.databaseServices.user.findUnique({
      where: { id: user.id },
    });
  }
}
