import HttpService from '../http.service';
import { getUserData } from '../../utils';
import { API_KEYS } from '../../constants';
import { IAccount, IQueryResponse } from '../../types';

class AccountService extends HttpService {
  async getAccounts(): Promise<IAccount[]> {
    const result = await this.post<IQueryResponse<IAccount>>(API_KEYS.QUERY, {
      ...getUserData(),
      query: 'select * from account_view',
    });

    return result.rows;
  }

  async createAccount({ title }: { title: string }) {
    await this.post(API_KEYS.QUERY, {
      ...getUserData(),
      query: `SELECT create_account($1);`,
      variables: [title],
    });
  }

  async deleteById({ id }: { id: string }): Promise<void> {
    await this.post(API_KEYS.QUERY, {
      ...getUserData(),
      query: `DELETE FROM account WHERE id = $1;`,
      variables: [id],
    });
  }

  async getAccountTransactionsStatsById({ accountId }: { accountId: string }): Promise<any> {
    const result = await this.post<IQueryResponse<any>>(API_KEYS.QUERY, {
      ...getUserData(),
      query: 'SELECT * FROM get_account_transactions_stats_by_account_id($1)',
      variables: [accountId],
    });

    return result.rows[0];
  }
}

export const accountService = new AccountService();
