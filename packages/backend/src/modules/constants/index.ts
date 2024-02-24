export const PORT = 4200;

export const ROLES = ['super_parent', 'parent', 'child'];

// export const CRON_INTERVAL = '*/1 * * * *'; // every min
export const CRON_INTERVAL = '0 0 * * *'; // every 00:00

export const PG_CONF = Object.freeze({
  port: 5432,
  host: 'localhost',
  database: 'budgeting_app',
});
