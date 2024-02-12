import HttpService from '../http.service';
import { API_KEYS } from '../../constants';
import { getPostgresDate, getUserData } from '../../utils';
import {
  IUserStats,
  IAccountStats,
  IQueryResponse,
  ITransactionType,
  IAccountStatsRange,
} from '../../types';

class StatsService extends HttpService {
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
        query: `SELECT * FROM category_percentage($1, 1, $2, $3);`,
        variables: [type, beforeDate, accountId],
      }
    );

    const quarterStats = await this.post<IQueryResponse<IAccountStats>>(
      API_KEYS.QUERY,
      {
        ...userData,
        query: `SELECT * FROM category_percentage($1, 3, $2, $3);`,
        variables: [type, beforeDate, accountId],
      }
    );

    const yearStats = await this.post<IQueryResponse<IAccountStats>>(
      API_KEYS.QUERY,
      {
        ...userData,
        query: `SELECT * FROM category_percentage($1, 12, $2, $3);`,
        variables: [type, beforeDate, accountId],
      }
    );

    return {
      month: monthStats.rows,
      quarter: quarterStats.rows,
      year: yearStats.rows,
    };
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
