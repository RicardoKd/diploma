/* eslint-disable @typescript-eslint/naming-convention */
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
      variables: [title]
    });
  }
}

export const accountService = new AccountService();
