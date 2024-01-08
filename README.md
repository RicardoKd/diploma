1. Connecting to PostgreSQL database

```shell
yarn add pg pg-hstore sequelize
```


```js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost', // TODO: Maybe add port number too?
  dialect: 'postgres',
  logging: (...msg) => console.log(msg), // Displays all log function call parameters instead of only the first parameter (default variant)
  dialectOptions: {
    // Your pg options here
  }
});

// console.log('pool :>> ', connection.connectionManager.pool);

// Executing raw queries
const users = await sequelize.query("SELECT * FROM `users`", { type: QueryTypes.SELECT });

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

await sequelize.close();
```
  // TODO: ReturnType<typeof serviceMethod>
