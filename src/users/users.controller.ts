import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RequestWithUser } from 'src/utils/RequestWithUser';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  findUsers(@Req() req: RequestWithUser) {
    const user = req.user;
    return this.usersService.findUsers(user);
  }
}
