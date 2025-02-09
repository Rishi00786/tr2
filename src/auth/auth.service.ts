import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from 'src/users/DTO/createUserDTO';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService,
  ) {}

  async signIn(userDTO: CreateUserDTO, response: Response) {
    const { userId, password } = userDTO;

    let user = await this.databaseService.user.findUnique({
      where: { userId },
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await this.databaseService.user.create({
        data: { userId, password: hashedPassword },
      });
    } else {
      if (!(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }
    }

    const payload = { id: user.id, userId: user.userId, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);

    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    response.cookie('Authentication', access_token, {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      expires,
    });

    return { payload };
  }
}
