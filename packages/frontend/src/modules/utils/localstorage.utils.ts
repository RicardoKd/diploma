import { STORAGE_KEYS } from '../constants';

const { USER, ROLE, PASSWORD } = STORAGE_KEYS;

// USER
export const logOut = () => {
  localStorage.removeItem(USER);
  localStorage.removeItem(ROLE);
  localStorage.removeItem(PASSWORD);
};

export const logIn = (user: string, password: string, role: string) => {
  localStorage.setItem(USER, user);
  localStorage.setItem(ROLE, role);
  localStorage.setItem(PASSWORD, password);
};

export const getUserData = () => ({
  user: localStorage.getItem(USER),
  password: localStorage.getItem(PASSWORD)
});

export const isLoggedIn = () => localStorage.getItem(USER) && localStorage.getItem(PASSWORD);

export const getRole = () => localStorage.getItem(ROLE);
