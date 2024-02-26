import HttpService from '../http.service';
import { API_KEYS } from '../../constants';
import { IUserDataBody } from './IUserDataBody';
import { getUserData, logIn } from '../../utils';
import { IQueryResponse, IRole } from '../../types';

class UserService extends HttpService {
  async login(data: IUserDataBody): Promise<IRole> {
    const { role } = await this.post<{ role: IRole }>(API_KEYS.LOGIN, data);

    logIn(data.user, data.password, role);

    return role;
  }

  async createChild({ user, password }: IUserDataBody): Promise<void> {
    await this.post<IQueryResponse>(API_KEYS.QUERY, {
      ...getUserData(),
      query: `SELECT create_child ($1, $2);`,
      variables: [user, password],
    });
  }

  async createParent({ user, password }: IUserDataBody): Promise<void> {
    await this.post<IQueryResponse>(API_KEYS.QUERY, {
      ...getUserData(),
      query: `SELECT create_parent ($1, $2);`,
      variables: [user, password],
    });
  }
}

export const userService = new UserService();
