import { Client } from 'pg';
import {
  differenceInCalendarDays,
  differenceInCalendarWeeks,
  differenceInCalendarMonths,
  differenceInCalendarYears,
} from 'date-fns';

import { IRecurringTransaction } from '../../types';

export class RecurringTransactionService {
  constructor(private db: Client) {}

  async processRecurringTransactions() {
    console.log('processRecurringTransactions fired');

    const recurringTransactions = await this.db.query(
      'SELECT * FROM all_recurring_transactions_view'
    );

    console.log(
      'recurringTransactions.rows.length :>> ',
      recurringTransactions.rows.length
    );

    for (const tr of recurringTransactions.rows) {
      await this.process(tr);
    }
  }

  async process(tr: IRecurringTransaction) {
    if (
      this.isRightDay(
        tr.start_date,
        tr.time_gap_type_value,
        tr.time_gap_type_id
      )
    ) {
      await this.db.query(
        `INSERT INTO ${tr.type} (notes, record_date, amount_of_money, account_id, category_id) VALUES ($1, $2, $3, $4, $5)`,
        [
          tr.notes,
          new Date(),
          tr.amount_of_money,
          tr.account_id,
          tr.category_id,
        ]
      );
    }
  }

  isRightDay(startDate: Date, gapValue: number, gapTypeId: number) {
    const today = new Date();
    let diff;

    switch (gapTypeId) {
      case 1: // Day
        diff = differenceInCalendarDays(today, startDate);
        break;
      case 2: // Week
        diff = differenceInCalendarWeeks(today, startDate);
        break;
      case 3: // Month
        diff = differenceInCalendarMonths(today, startDate);
        break;
      case 4: // Year
        diff = differenceInCalendarYears(today, startDate);
        break;
      default:
        throw new Error('Invalid time gap type');
    }

    // Check if this difference is a multiple of the gap value
    return diff % gapValue === 0;
  }
}
