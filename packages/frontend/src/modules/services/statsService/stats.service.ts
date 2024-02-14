import HttpService from '../http.service';
import { getUserData } from '../../utils';
import { API_KEYS } from '../../constants';
import {
  IUserStats,
  IQueryResponse,
  ITransactionType,
  ICategoryPercentage,
  ICategoriesStats,
} from '../../types';

class StatsService extends HttpService {
  async getCategoriesStatsByAccountId({
    accountId,
  }: {
    accountId: string;
  }): Promise<ICategoriesStats> {
    const income = await this.post<IQueryResponse<ICategoryPercentage>>(
      API_KEYS.QUERY,
      {
        ...getUserData(),
        query: `SELECT * FROM get_ranged_income_categories_percentage_by_account_id($1);`,
        variables: [accountId],
      }
    );

    const spend = await this.post<IQueryResponse<ICategoryPercentage>>(
      API_KEYS.QUERY,
      {
        ...getUserData(),
        query: `SELECT * FROM get_ranged_spend_categories_percentage_by_account_id($1);`,
        variables: [accountId],
      }
    );

    return { income: income.rows, spend: spend.rows };
  }

  async getCategoriesStats(): Promise<ICategoriesStats> {
    const income = await this.post<IQueryResponse<ICategoryPercentage>>(
      API_KEYS.QUERY,
      {
        ...getUserData(),
        query: `SELECT * FROM get_ranged_income_categories_percentage();`,
      }
    );

    const spend = await this.post<IQueryResponse<ICategoryPercentage>>(
      API_KEYS.QUERY,
      {
        ...getUserData(),
        query: `SELECT * FROM get_ranged_income_categories_percentage();`,
      }
    );

    return { income: income.rows, spend: spend.rows };
  }

  async getUsersStats(): Promise<IUserStats[]> {
    const result = await this.post<IQueryResponse<IUserStats>>(API_KEYS.QUERY, {
      ...getUserData(),
      query: `SELECT * FROM get_users_stats();`,
    });

    return result.rows;
  }
}

export const statsService = new StatsService();
