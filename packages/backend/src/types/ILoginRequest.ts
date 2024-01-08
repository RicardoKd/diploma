import { Request } from 'express';

export interface ILoginRequest extends Request {
  body: {
    user: string;
    password: string;
  };
}
