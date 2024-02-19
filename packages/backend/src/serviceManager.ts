import cron from 'node-cron';
import { RecurringTransactionService } from './modules/services';
import { CRON_INTERVAL } from './modules/constants';
import { connectServiceToDB } from './modules/db';

export const startRecurringTransactionsService = async () => {
  const db = await connectServiceToDB();
  const recurringTransactionService = new RecurringTransactionService(db);

  cron.schedule(CRON_INTERVAL, () => {
    recurringTransactionService.processRecurringTransactions();
  });

  console.log('Recurring Transactions Service Started');
};
