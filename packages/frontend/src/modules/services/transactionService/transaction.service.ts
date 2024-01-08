/* eslint-disable @typescript-eslint/naming-convention */
import HttpService from '../http.service';
import { API_KEYS } from '../../constants';
import { getPostgresDate, getUserData } from '../../utils';
import {
  ICategory,
  ITransaction,
  IAccountStats,
  IQueryResponse,
  ITransactionType,
  IAccountStatsRange,
  IRecurringTransaction
} from '../../types';

class TransactionService extends HttpService {
  async getTransactions(accountId: number): Promise<ITransaction[]> {
    const result = await this.post<IQueryResponse<ITransaction>>(API_KEYS.QUERY, {
      ...getUserData(),
      query: `select * from transactions_by_account_id(${accountId})`
    });

    const rows = result.rows.map((transaction) => ({
      ...transaction,
      record_date: new Date(new Date(transaction.record_date).toUTCString()),
      amount_of_money: +transaction.amount_of_money
    }));

    return rows;
  }

  async createTransaction({
    type,
    notes,
    category,
    accountId,
    record_date,
    amount_of_money
  }: any): Promise<void> {
    await this.post(API_KEYS.QUERY, {
      ...getUserData(),
      query: `INSERT INTO ${type} 
        (notes, record_date, amount_of_money, account_id, category_id) VALUES 
        ('${notes}', '${record_date}', ${Math.abs(amount_of_money)}, ${accountId!}, ${category})
      `
    });
  }

  async updateTransaction({
    _id,
    notes,
    type,
    amount_of_money,
    record_date,
    category
  }: ITransaction): Promise<void> {
    await this.post(API_KEYS.QUERY, {
      ...getUserData(),
      query: `UPDATE ${type} 
        SET 
          notes = '${notes}',
          category_id = ${category},
          record_date = '${getPostgresDate(record_date)}',
          amount_of_money = ${Math.abs(amount_of_money)}
        WHERE _id = ${_id};
      `
    });
  }

  // {
  //   _id,
  //   notes,
  //   type,
  //   amount_of_money,
  //   record_date,
  //   category
  // }
  async updateRecurringTransaction(): Promise<void> {
    throw new Error('NOT IMPLEMENTED');
    // await this.post(API_KEYS.QUERY, {
    //   ...getUserData(),
    //   query: `UPDATE ${type}
    //     SET
    //       notes = '${notes}',
    //       category_id = ${category},
    //       record_date = '${getPostgresDate(record_date)}',
    //       amount_of_money = ${Math.abs(amount_of_money)}
    //     WHERE _id = ${_id};
    //   `
    // });
  }

  async getRecurringTransactions(
    type: ITransactionType,
    accountId: number
  ): Promise<IRecurringTransaction[]> {
    const result = await this.post<IQueryResponse<IRecurringTransaction>>(API_KEYS.QUERY, {
      ...getUserData(),
      query: `select * from recurring_${type}_view where account_id = ${accountId}`
    });

    const rows = result.rows.map((transaction) => ({
      ...transaction,
      amount_of_money: +transaction.amount_of_money,
      end_date: new Date(new Date(transaction.end_date).toUTCString()),
      start_date: new Date(new Date(transaction.start_date).toUTCString())
    }));

    return rows;
  }

  async createRecurringTransaction({
    type,
    notes,
    category,
    end_date,
    accountId,
    start_date,
    time_gap_type,
    amount_of_money,
    time_gap_type_value
  }: any): Promise<void> {
    await this.post(API_KEYS.QUERY, {
      ...getUserData(),
      query: `INSERT INTO recurring_${type} 
        (notes, end_date, start_date, amount_of_money, time_gap_type_value, time_gap_type_id, category_id, account_id) VALUES
        (
        '${notes}', 
        '${end_date}', 
        '${start_date}', 
        ${Math.abs(amount_of_money)}, 
        '${time_gap_type_value}', 
        ${time_gap_type}, 
        ${category},
        ${accountId}
        )
      `
    });
  }

  async deleteById({ table, id }: { table: string; id: number }): Promise<void> {
    await this.post(API_KEYS.QUERY, {
      ...getUserData(),
      query: `DELETE FROM ${table} WHERE _id = ${id};
      `
    });
  }

  async getCategories(type: ITransactionType): Promise<ICategory[]> {
    const { rows } = await this.post<IQueryResponse<ICategory>>(API_KEYS.QUERY, {
      ...getUserData(),
      query: `select * from ${type}_category`
    });

    return rows;
  }

  async getCategoryStats({
    type,
    accountId
  }: {
    accountId: number;
    type: ITransactionType;
  }): Promise<IAccountStatsRange> {
    const beforeDate = getPostgresDate(new Date());
    const userData = getUserData();

    const monthStats = await this.post<IQueryResponse<IAccountStats>>(API_KEYS.QUERY, {
      ...userData,
      query: `SELECT * FROM category_percentage
        ('${type}', 1, '${beforeDate}', ${accountId});`
    });

    const quarterStats = await this.post<IQueryResponse<IAccountStats>>(API_KEYS.QUERY, {
      ...userData,
      query: `SELECT * FROM category_percentage
        ('${type}', 3, '${beforeDate}', ${accountId});`
    });

    const yearStats = await this.post<IQueryResponse<IAccountStats>>(API_KEYS.QUERY, {
      ...userData,
      query: `SELECT * FROM category_percentage
        ('${type}', 12, '${beforeDate}', ${accountId});`
    });

    return { month: monthStats.rows, quarter: quarterStats.rows, year: yearStats.rows };
  }
}

export const transactionService = new TransactionService();
