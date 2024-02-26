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

  async createAccount({ title }: { title: string }): Promise<boolean> {
    const result = await this.post<IQueryResponse>(API_KEYS.QUERY, {
      ...getUserData(),
      query: `SELECT create_account($1);`,
      variables: [title],
    });

    return result.rowCount >= 1;
  }

  async deleteById({ id }: { id: string }): Promise<boolean> {
    const result = await this.post<IQueryResponse>(API_KEYS.QUERY, {
      ...getUserData(),
      query: `DELETE FROM account WHERE id = $1;`,
      variables: [id],
    });

    return result.rowCount >= 1;
  }
}

export const accountService = new AccountService();
