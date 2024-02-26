import HttpService from '../http.service';
import { getUserData } from '../../utils';
import { API_KEYS } from '../../constants';
import {
  IQueryResponse,
  ICategoryRangeStats,
  IIncomeSpendRangeStats,
  IMonthlyIncomeSpendStats,
  IUserTransactionsRangeStats,
  IIncomeSpendCategoriesRangeStats,
  IUserPopularCategoriesRangeStats,
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

  async getPopularCategoriesStats(): Promise<
    IUserPopularCategoriesRangeStats[]
  > {
    const result = await this.post<
      IQueryResponse<IUserPopularCategoriesRangeStats>
    >(API_KEYS.QUERY, {
      ...getUserData(),
      query: `SELECT * FROM get_popular_categories_stats();`,
    });

    return result.rows;
  }

  async getMonthlyIncomeSpendStats({
    accountId,
  }: {
    accountId: string;
  }): Promise<IMonthlyIncomeSpendStats[]> {
    const result = await this.post<IQueryResponse<IMonthlyIncomeSpendStats>>(
      API_KEYS.QUERY,
      {
        ...getUserData(),
        query: `SELECT * FROM get_monthly_income_spend_stats($1);`,
        variables: [accountId],
      }
    );

    return result.rows;
  }
}

export const statsService = new StatsService();
