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
  INCOME_CATEGORIES: 'incomeCatogories',
  RECURRING_TRANSACTIONS: 'recurringTransactions',
  ACCOUNT_TRANSACTIONS_STATS: 'accountTransactionsStats',
});

export const ROUTER_KEYS = Object.freeze({
  ANY: '/*',
  HOME: '/home',
  LOGIN: '/login',
  PROFILE: '/profile',
  ACCOUNT: '/account',
  START: '/family-budgeting',
  ACCOUNT_STATS: '/account/statistics',
});

// API keys
export const API_KEYS = Object.freeze({
  LOGIN: 'login',
  QUERY: 'query',
});
