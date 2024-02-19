import { Client } from 'pg';
import { PG_CONF, ROLES } from '../constants';

export async function connectUserToDB(
  user: string,
  password: string
): Promise<Client> {
  if (!user || !password) {
    throw new Error('User and password must be provided');
  }

  const client = new Client({ user, password, ...PG_CONF });

  client.on('error', (error) => {
    console.error(error);
    process.exit(-1);
  });

  await client.connect();

  let result = await client.query('select get_my_role()');

  const role = result.rows[0].get_my_role;

  if (!ROLES.includes(role)) {
    throw new Error('Cannot login');
  }

  return client;
}

export async function connectServiceToDB(): Promise<Client> {
  const client = new Client({ user: 'test', password: 'test', ...PG_CONF });

  client.on('error', (error) => {
    console.error(error);
    process.exit(-1);
  });

  await client.connect();

  return client;
}
