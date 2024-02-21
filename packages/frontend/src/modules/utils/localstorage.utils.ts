import queryClient from '../app/queryClient';
import { QUERY_KEYS, STORAGE_KEYS } from '../constants';

const { USER, ROLE, PASSWORD } = STORAGE_KEYS;

// USER
export const logOut = () => {
  localStorage.removeItem(USER);
  localStorage.removeItem(ROLE);
  localStorage.removeItem(PASSWORD);
  queryClient.clear();
  queryClient.setQueryData([QUERY_KEYS.IS_LOGGED_IN], false);
};

export const logIn = (user: string, password: string, role: string) => {
  queryClient.setQueryData([QUERY_KEYS.IS_LOGGED_IN], true);
  localStorage.setItem(USER, user);
  localStorage.setItem(ROLE, role);
  localStorage.setItem(PASSWORD, password);
};

export const getUserData = () => ({
  user: localStorage.getItem(USER),
  password: localStorage.getItem(PASSWORD),
});

export const getUserName = () => localStorage.getItem(USER);

export const getIsLoggedIn = () =>
  !!(localStorage.getItem(USER) && localStorage.getItem(PASSWORD));

export const getRole = () => localStorage.getItem(ROLE);
