import { Request } from 'express';
import { User } from '@prisma/client';
export type RequestWithUser = Request & {
  user: User;
};
