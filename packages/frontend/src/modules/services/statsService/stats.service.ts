import HttpService from '../http.service';
import { getUserData } from '../../utils';
import { API_KEYS } from '../../constants';
import {
  IUserTransactionsRangeStats,
  IQueryResponse,
  IIncomeSpendCategoriesRangeStats,
  IIncomeSpendRangeStats,
  ICategoryRangeStats,
} from '../../types';

class StatsService extends HttpService {
  async getAccountTransactionsStatsById({
    accountId,
  }: {
    accountId: string;
  }): Promise<IIncomeSpendRangeStats> {
    const result = await this.post<IQueryResponse<IIncomeSpendRangeStats>>(
      API_KEYS.QUERY,
      {
        ...getUserData(),
        query: 'SELECT * FROM get_account_transactions_stats_by_account_id($1)',
        variables: [accountId],
      }
    );

    return result.rows[0];
  }

  async getCategoriesStatsByAccountId({
    accountId,
  }: {
    accountId: string;
  }): Promise<IIncomeSpendCategoriesRangeStats> {
    const income = await this.post<IQueryResponse<ICategoryRangeStats>>(
      API_KEYS.QUERY,
      {
        ...getUserData(),
        query: `SELECT * FROM get_ranged_income_categories_percentage_by_account_id($1);`,
        variables: [accountId],
      }
    );

    const spend = await this.post<IQueryResponse<ICategoryRangeStats>>(
      API_KEYS.QUERY,
      {
        ...getUserData(),
        query: `SELECT * FROM get_ranged_spend_categories_percentage_by_account_id($1);`,
        variables: [accountId],
      }
    );

    return { income: income.rows, spend: spend.rows };
  }

  async getCategoriesStats(): Promise<IIncomeSpendCategoriesRangeStats> {
    const income = await this.post<IQueryResponse<ICategoryRangeStats>>(
      API_KEYS.QUERY,
      {
        ...getUserData(),
        query: `SELECT * FROM get_ranged_income_categories_percentage();`,
      }
    );

    const spend = await this.post<IQueryResponse<ICategoryRangeStats>>(
      API_KEYS.QUERY,
      {
        ...getUserData(),
        query: `SELECT * FROM get_ranged_spend_categories_percentage();`,
      }
    );

    return { income: income.rows, spend: spend.rows };
  }

  async getUsersRangedTransactionsStats(): Promise<
    IUserTransactionsRangeStats[]
  > {
    const result = await this.post<IQueryResponse<IUserTransactionsRangeStats>>(
      API_KEYS.QUERY,
      {
        ...getUserData(),
        query: `SELECT * FROM get_ranged_users_transactions_stats();`,
      }
    );

    return result.rows;
  }

  async getPopularCategoriesStats(): Promise<{}[]> {
    throw new Error('NOT IMPLEMENTED');

    const income = await this.post<IQueryResponse<{}>>(API_KEYS.QUERY, {
      ...getUserData(),
      query: `select * from popular_income_categories_stats;`,
    });

    const spend = await this.post<IQueryResponse<{}>>(API_KEYS.QUERY, {
      ...getUserData(),
      query: `select * from popular_spend_categories_stats;`,
    });

    // return { income: income.rows, spend: spend.rows };
  }
}

export const statsService = new StatsService();
