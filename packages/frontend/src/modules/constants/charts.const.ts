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
    scales: {
      y: {
        title: {
          display: true,
          text: 'Amount of money $',
        },
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
  MONTHLY_INCOME_SPEND_STATS: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Incomes and spends fro the last 12 months',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Amount of money $',
        },
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
      scales: {
        y: {
          title: {
            display: true,
            text: 'Percentage %',
          },
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
      scales: {
        y: {
          title: {
            display: true,
            text: 'Percentage %',
          },
        },
      },
    },
  },
});
