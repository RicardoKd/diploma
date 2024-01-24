// Local storage keys
export const STORAGE_KEYS = {
  USER: 'user',
  ROLE: 'role',
  PASSWORD: 'password',
};

// React-query keys
export const QUERY_KEYS = Object.freeze({
  TODOS: 'todos',
  FILTER: 'filter',
  ACCOUNTS: 'accounts',
  ALERT_STACK: 'alertStack',
  SPEND_STATS: 'spendStats',
  INCOME_STATS: 'incomeStats',
  TRANSACTIONS: 'transactions',
  CURRENT_ACCOUNT: 'currentAccount',
  SPEND_CATEGORIES: 'spendCategories',
  RECURRING_SPENDS: 'recurringSpends',
  INCOME_CATEGORIES: 'incomeCatogories',
  RECURRING_INCOMES: 'recurringIncomes',
});

export const ROUTER_KEYS = Object.freeze({
  ANY: '/*',
  START: '/',
  HOME: '/home',
  LOGIN: '/login',
  PROFILE: '/profile',
  VIEW_ACCOUNT: '/account',
  ACCOUNT_STATS: '/account/stats',
});

// API keys
export const API_KEYS = Object.freeze({
  LOGIN: 'login',
  QUERY: 'query',
});
