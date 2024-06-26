import HttpService from '../http.service';
import { API_KEYS } from '../../constants';
import { getPostgresDate, getUserData } from '../../utils';
import {
  ICategory,
  ITransaction,
  IQueryResponse,
  TransactionType,
  IRecurringTransaction,
} from '../../types';

class TransactionService extends HttpService {
  async getTransactions({
    accountId,
  }: {
    accountId: string;
  }): Promise<ITransaction[]> {
    const result = await this.post<IQueryResponse<ITransaction>>(
      API_KEYS.QUERY,
      {
        ...getUserData(),
        query: `SELECT * FROM transactions_by_account_id($1)`,
        variables: [accountId],
      }
    );

    const rows = result.rows.map((transaction) => ({
      ...transaction,
      amount_of_money: +transaction.amount_of_money,
      record_date: new Date(transaction.record_date),
    }));

    return rows;
  }

  /* 
    FIXME:
    tr is any, thought it should be ITransaction 
    because the field category is not an object as in ITransaction,
    but a string which is category_id
  */
  async createTransaction(tr: any): Promise<boolean> {
    const result = await this.post<IQueryResponse>(API_KEYS.QUERY, {
      ...getUserData(),
      query: `INSERT INTO ${tr.type} 
        (notes, record_date, amount_of_money, account_id, category_id)
        VALUES ($1, $2, $3::MONEY, $4, $5)
      `,
      variables: [
        tr.notes,
        tr.record_date,
        Math.abs(tr.amount_of_money),
        tr.account_id,
        tr.category,
      ],
    });

    return result.rowCount >= 1;
  }

  async updateTransaction(tr: ITransaction): Promise<boolean> {
    const result = await this.post<IQueryResponse>(API_KEYS.QUERY, {
      ...getUserData(),
      query: `UPDATE ${tr.type} 
        SET 
          notes = $1,
          category_id = $2,
          record_date = $3,
          amount_of_money = $4
        WHERE id = $5;
      `,
      variables: [
        tr.notes,
        tr.category.id,
        getPostgresDate(tr.record_date),
        Math.abs(tr.amount_of_money),
        tr.id,
      ],
    });

    return result.rowCount >= 1;
  }

  async getRecurringTransactions({
    accountId,
  }: {
    accountId: string;
  }): Promise<IRecurringTransaction[]> {
    const result = await this.post<IQueryResponse<IRecurringTransaction>>(
      API_KEYS.QUERY,
      {
        ...getUserData(),
        query: `select * from recurring_transactions_by_account_id($1)`,
        variables: [accountId],
      }
    );

    const rows = result.rows.map((transaction) => ({
      ...transaction,
      end_date: new Date(transaction.end_date),
      start_date: new Date(transaction.start_date),
      amount_of_money: +transaction.amount_of_money,
    }));

    return rows;
  }

  /* 
    FIXME:
    tr is any, thought it should be IRecurringTransaction 
    because the field category is not an object as in IRecurringTransaction,
    but a string which is category_id
    AND
    because the field time_gap_type is not an object as in IRecurringTransaction,
    but a string which is time_gap_type_id
  */
  async createRecurringTransaction(tr: any): Promise<boolean> {
    const result = await this.post<IQueryResponse>(API_KEYS.QUERY, {
      ...getUserData(),
      query: `INSERT INTO recurring_${tr.type} 
        (notes, end_date, start_date, amount_of_money, time_gap_type_value, time_gap_type_id, category_id, account_id)
        VALUES ($1, $2, $3, $4::MONEY, $5, $6, $7, $8)
      `,
      variables: [
        tr.notes,
        tr.end_date,
        tr.start_date,
        tr.amount_of_money,
        tr.time_gap_type_value,
        tr.time_gap_type,
        tr.category,
        tr.accountId,
      ],
    });

    return result.rowCount >= 1;
  }

  async updateRecurringTransaction(tr: IRecurringTransaction): Promise<boolean> {
    const result = await this.post<IQueryResponse>(API_KEYS.QUERY, {
      ...getUserData(),
      query: `UPDATE recurring_${tr.type}
        SET
          notes = $1,
          end_date = $2,
          start_date = $3,
          amount_of_money = $4,
          time_gap_type_value = $5,
          time_gap_type_id = $6,
          category_id = $7
        WHERE id = $8;
      `,
      variables: [
        tr.notes,
        getPostgresDate(tr.end_date),
        getPostgresDate(tr.start_date),
        Math.abs(tr.amount_of_money),
        tr.time_gap_type_value,
        tr.time_gap_type.id,
        tr.category.id,
        tr.id,
      ],
    });

    return result.rowCount >= 1;
  }

  async deleteById({
    id,
    table,
  }: {
    id: string;
    table: string;
  }): Promise<boolean> {
    const result = await this.post<IQueryResponse>(API_KEYS.QUERY, {
      ...getUserData(),
      query: `DELETE FROM ${table} WHERE id = $1;`,
      variables: [id],
    });

    return result.rowCount >= 1;
  }

  async getCategories({
    type,
  }: {
    type: TransactionType;
  }): Promise<ICategory[]> {
    const result = await this.post<IQueryResponse<ICategory>>(API_KEYS.QUERY, {
      ...getUserData(),
      query: `SELECT id AS value, title AS label FROM ${type}_category`,
    });

    return result.rows;
  }
}

export const transactionService = new TransactionService();
