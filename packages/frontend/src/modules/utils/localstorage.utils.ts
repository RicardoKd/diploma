import { STORAGE_KEYS } from '../constants';
import { redirect } from "react-router-dom";
import queryClient from '../app/queryClient';

const { USER, ROLE, PASSWORD } = STORAGE_KEYS;

// USER
export const logOut = () => {
  localStorage.removeItem(USER);
  localStorage.removeItem(ROLE);
  localStorage.removeItem(PASSWORD);
  queryClient.clear();
};

export const logIn = (user: string, password: string, role: string) => {
  localStorage.setItem(USER, user);
  localStorage.setItem(ROLE, role);
  localStorage.setItem(PASSWORD, password);
};

export const getUserData = () => {
  const user = localStorage.getItem(USER);
  const password = localStorage.getItem(PASSWORD);
  console.log("enteting getUserData");
  if (!user || !password) {
    console.log("inside IF");
    redirect("/login");
  }

  return { user, password };
};

export const isLoggedIn = () =>
  localStorage.getItem(USER) && localStorage.getItem(PASSWORD);

export const getRole = () => localStorage.getItem(ROLE);
