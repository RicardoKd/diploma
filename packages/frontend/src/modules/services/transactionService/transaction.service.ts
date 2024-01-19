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
  IRecurringTransaction,
} from '../../types';

class TransactionService extends HttpService {
  async getTransactions(accountId: string): Promise<ITransaction[]> {
    const result = await this.post<IQueryResponse<ITransaction>>(
      API_KEYS.QUERY,
      {
        ...getUserData(),
        query: `select * from transactions_by_account_id('${accountId}')`,
      }
    );

    const rows = result.rows.map((transaction) => ({
      ...transaction,
      amount_of_money: +transaction.amount_of_money,
      record_date: new Date(transaction.record_date),
    }));

    return rows;
  }

  async createTransaction(tr: any): Promise<void> {
    await this.post(API_KEYS.QUERY, {
      ...getUserData(),
      query: `INSERT INTO ${tr.type} 
        (notes, record_date, amount_of_money, account_id, category_id) VALUES 
        ('${tr.notes}', '${tr.record_date}', ${Math.abs(
          tr.amount_of_money
      )}, '${tr.accountId!}', '${tr.category}')
      `,
    });
  }

  async updateTransaction(tr: ITransaction): Promise<void> {
    await this.post(API_KEYS.QUERY, {
      ...getUserData(),
      query: `UPDATE ${tr.type} 
        SET 
          notes = '${tr.notes}',
          category_id = '${tr.category.id}',
          record_date = '${getPostgresDate(tr.record_date)}',
          amount_of_money = ${Math.abs(tr.amount_of_money)}
        WHERE id = '${tr.id}';
      `,
    });
  }

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
    accountId: string
  ): Promise<IRecurringTransaction[]> {
    const result = await this.post<IQueryResponse<IRecurringTransaction>>(
      API_KEYS.QUERY,
      {
        ...getUserData(),
        query: `select * from recurring_${type}_view where account_id = '${accountId}'`,
      }
    );

    const rows = result.rows.map((transaction) => ({
      ...transaction,
      amount_of_money: +transaction.amount_of_money,
      end_date: new Date(new Date(transaction.end_date).toUTCString()),
      start_date: new Date(new Date(transaction.start_date).toUTCString()),
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
    time_gap_type_value,
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
      `,
    });
  }

  async deleteById({
    table,
    id,
  }: {
    table: string;
    id: string;
  }): Promise<void> {
    await this.post(API_KEYS.QUERY, {
      ...getUserData(),
      query: `DELETE FROM ${table} WHERE id = '${id}';
      `,
    });
  }

  async getCategories(type: ITransactionType): Promise<ICategory[]> {
    const { rows } = await this.post<IQueryResponse<ICategory>>(
      API_KEYS.QUERY,
      {
        ...getUserData(),
        query: `select * from ${type}_category`,
      }
    );

    return rows;
  }

  async getCategoryStats({
    type,
    accountId,
  }: {
    accountId: string;
    type: ITransactionType;
  }): Promise<IAccountStatsRange> {
    const beforeDate = getPostgresDate(new Date());
    const userData = getUserData();

    const monthStats = await this.post<IQueryResponse<IAccountStats>>(
      API_KEYS.QUERY,
      {
        ...userData,
        query: `SELECT * FROM category_percentage
        ('${type}', 1, '${beforeDate}', ${accountId});`,
      }
    );

    const quarterStats = await this.post<IQueryResponse<IAccountStats>>(
      API_KEYS.QUERY,
      {
        ...userData,
        query: `SELECT * FROM category_percentage
        ('${type}', 3, '${beforeDate}', ${accountId});`,
      }
    );

    const yearStats = await this.post<IQueryResponse<IAccountStats>>(
      API_KEYS.QUERY,
      {
        ...userData,
        query: `SELECT * FROM category_percentage
        ('${type}', 12, '${beforeDate}', ${accountId});`,
      }
    );

    return {
      month: monthStats.rows,
      quarter: quarterStats.rows,
      year: yearStats.rows,
    };
  }
}

export const transactionService = new TransactionService();
