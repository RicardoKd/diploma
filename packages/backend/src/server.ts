/* eslint-disable no-console */
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

import { PORT } from './const';
import appRouter from './routes';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
appRouter(app);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app;
