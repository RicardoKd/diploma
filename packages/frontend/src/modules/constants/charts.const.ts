export const OPTIONS = Object.freeze({
  USERS_STATS: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Incomes and spends by user',
      },
    },
  },
  ACCOUNT_TRANSACTION_STATS: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Spends to incomes ratio',
      },
    },
  },
  CATEGORIES_STATS: {
    income: {
      plugins: {
        title: {
          display: true,
          text: 'Income categories statistics',
        },
        legend: {
          display: false,
        },
      },
    },
    spend: {
      plugins: {
        title: {
          display: true,
          text: 'Spend categories statistics',
        },
        legend: {
          display: false,
        },
      },
    },
  },
});
