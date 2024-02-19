import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

import appRouter from './modules/routes';
import { PORT } from './modules/constants';
import { startRecurringTransactionsService } from './serviceManager';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
appRouter(app);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  startRecurringTransactionsService();
});

export default app;
