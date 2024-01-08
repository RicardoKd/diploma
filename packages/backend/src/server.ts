/* eslint-disable no-console */
import cors from 'cors';
import { Client } from 'pg';
import bodyParser from 'body-parser';
import express, { Response } from 'express';

import { PORT, PG_CONF } from './const';
import { ILoginRequest, IQueryRequest } from './types';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post('/login', async ({ body }: ILoginRequest, res: Response) => {
  try {
    const { user, password } = body;

    const client = new Client({ user, password, ...PG_CONF });

    await client.connect();

    const result = await client.query('select get_my_role()');

    const role = result.rows[0].get_my_role;

    client.end();

    return res.json({ role });
  } catch (error: any) {
    console.error(error.message);

    return res.status(401).json({ error: error.message });
  }
});

app.post('/query', async ({ body }: IQueryRequest, res: Response) => {
  try {
    const { user, password, query } = body;

    const client = new Client({ user, password, ...PG_CONF });

    await client.connect();

    const result = await client.query(query);

    client.end();

    return res.json(result);
  } catch (error: any) {
    console.error(error.message);

    return res.status(500).json({ error: error.message });
  }
});

const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default server;
