import { IRole } from '../../types';
import HttpService from '../http.service';
import { API_KEYS } from '../../constants';
import { IUserDataBody } from './IUserDataBody';
import { getUserData, logIn } from '../../utils';

class UserService extends HttpService {
  async login(data: IUserDataBody): Promise<IRole> {
    const { role } = await this.post<{ role: IRole }>(API_KEYS.LOGIN, data);

    logIn(data.user, data.password, role);

    return role;
  }

  async createChild({ user, password }: IUserDataBody) {
    await this.post(API_KEYS.QUERY, {
      ...getUserData(),
      query: `select create_child ($1, $2);`,
      variables: [user, password],
    });
  }

  async createParent({ user, password }: IUserDataBody) {
    await this.post(API_KEYS.QUERY, {
      ...getUserData(),
      query: `select create_parent ($1, $2);`,
      variables: [user, password],
    });
  }

  async getChildren() {
    await this.post(API_KEYS.QUERY, {
      ...getUserData(),
      query: 'select * from get_children();',
    });
  }
}

export const userService = new UserService();
