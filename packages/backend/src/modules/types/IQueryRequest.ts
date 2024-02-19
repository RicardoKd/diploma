import { Request } from 'express';

export interface IQueryRequest extends Request {
  body: {
    user: string;
    query: string;
    password: string;
    variables?: any[];
  };
}
