// Local storage keys
export const STORAGE_KEYS = Object.freeze({
  USER: 'user',
  ROLE: 'role',
  PASSWORD: 'password',
});

// React-query keys
export const QUERY_KEYS = Object.freeze({
  TODOS: 'todos',
  FILTER: 'filter',
  ACCOUNTS: 'accounts',
  USER_STATS: 'userStats',
  ALERT_STACK: 'alertStack',
  IS_LOGGED_IN: 'isLoggedIn',
  TRANSACTIONS: 'transactions',
  CURRENT_ACCOUNT: 'currentAccount',
  CATEGORIES_STATS: 'categoriesStats',
  SPEND_CATEGORIES: 'spendCategories',
  INCOME_CATEGORIES: 'incomeCatogories',
  RECURRING_TRANSACTIONS: 'recurringTransactions',
  ACCOUNT_TRANSACTIONS_STATS: 'accountTransactionsStats',
  CATEGORIES_BY_ACCOUNT_ID_STATS: 'categoriesByAccountIdStats',
});

export const ROUTER_KEYS = Object.freeze({
  ANY: '*',
  START: '/',
  HOME: '/home',
  LOGIN: '/login',
  PROFILE: '/profile',
  ACCOUNT: '/account',
  USER_STATS: '/statistics',
  ACCOUNT_STATS: '/account/statistics',
});

// API keys
export const API_KEYS = Object.freeze({
  LOGIN: 'login',
  QUERY: 'query',
});
