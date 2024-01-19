import { Application, Response } from 'express';

import connectDB from './db';
import { ILoginRequest, IQueryRequest } from './types';

const appRouter = (app: Application) => {
  app.post('/login', async ({ body }: ILoginRequest, res: Response) => {
    try {
      const client = await connectDB(body.user, body.password);

      let result = await client.query('select get_my_role()');

      const role = result.rows[0].get_my_role;

      client.end();

      return res.json({ role: role });
    } catch (error: any) {
      console.error(error.message);

      return res.status(401).json({ error: error.message });
    }
  });

  app.post('/query', async ({ body }: IQueryRequest, res: Response) => {
    try {
      const client = await connectDB(body.user, body.password);

      const result = await client.query(body.query, body.variables);

      client.end();

      return res.json(result);
    } catch (error: any) {
      console.error(error.message);

      return res.status(500).json({ error: error.message });
    }
  });
};

export default appRouter;
