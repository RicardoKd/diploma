import { Client } from 'pg';
import {
  differenceInCalendarDays,
  differenceInCalendarWeeks,
  differenceInCalendarMonths,
  differenceInCalendarYears,
} from 'date-fns';


export class RecurringTransactionService {
  constructor(private db: Client) {}

  async processRecurringTransactions() {
    console.log('processRecurringTransactions fired');

    // Fetch all active recurring transactions
    const recurringSpends = await this.db.query(
      'SELECT * FROM recurring_spend WHERE start_date <= now() AND end_date >= now()'
    );
    const recurringIncomes = await this.db.query(
      'SELECT * FROM recurring_income WHERE start_date <= now() AND end_date >= now()'
    );

    console.log('recurringIncomes.rows :>> ', recurringIncomes.rows.length);
    console.log('recurringSpends.rows :>> ', recurringSpends.rows.length);

    // Process each recurring transaction
    for (const rs of recurringSpends.rows) {
      await this.processRecurringSpend(rs);
    }
    for (const ri of recurringIncomes.rows) {
      await this.processRecurringIncome(ri);
    }
  }

  async processRecurringSpend(rs: any) {
    // If today is the right day to process this recurring spend
    if (
      this.isRightDay(
        rs.start_date,
        rs.time_gap_type_value,
        rs.time_gap_type_id
      )
    ) {
      // Insert into spend table
      await this.db.query(
        'INSERT INTO spend (notes, record_date, amount_of_money, account_id, category_id) VALUES ($1, $2, $3, $4, $5)',
        [
          rs.notes,
          new Date(),
          rs.amount_of_money,
          rs.account_id,
          rs.category_id,
        ]
      );
    }
  }

  async processRecurringIncome(ri: any) {
    // If today is the right day to process this recurring income
    if (
      this.isRightDay(
        ri.start_date,
        ri.time_gap_type_value,
        ri.time_gap_type_id
      )
    ) {
      // Insert into income table
      await this.db.query(
        'INSERT INTO income (notes, record_date, amount_of_money, account_id, category_id) VALUES ($1, $2, $3, $4, $5)',
        [
          ri.notes,
          new Date(),
          ri.amount_of_money,
          ri.account_id,
          ri.category_id,
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
