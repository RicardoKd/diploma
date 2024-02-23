export const OPTIONS = Object.freeze({
  USERS_STATS: (labelColor: string) => ({
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: labelColor,
        },
      },
      title: {
        display: true,
        color: labelColor,
        text: 'Incomes and spends by user',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          color: labelColor,
          text: 'Amount of money $',
        },
        ticks: {
          color: labelColor,
        },
      },
      x: {
        ticks: {
          color: labelColor,
        },
      },
    },
  }),
  ACCOUNT_TRANSACTION_STATS: (labelColor: string) => ({
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: labelColor,
        },
      },
      title: {
        display: true,
        color: labelColor,
        text: 'Spends to incomes ratio',
      },
    },
  }),
  MONTHLY_INCOME_SPEND_STATS: (labelColor: string) => ({
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: labelColor,
        },
      },
      title: {
        display: true,
        color: labelColor,
        text: 'Incomes and spends fro the last 12 months',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          color: labelColor,
          text: 'Amount of money $',
        },
        ticks: {
          color: labelColor,
        },
      },
      x: {
        ticks: {
          color: labelColor,
        },
      },
    },
  }),
  CATEGORIES_STATS: {
    income: (labelColor: string) => ({
      plugins: {
        title: {
          display: true,
          color: labelColor,
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
            color: labelColor,
            text: 'Percentage %',
          },
          ticks: {
            color: labelColor,
          },
        },
        x: {
          ticks: {
            color: labelColor,
          },
        },
      },
    }),
    spend: (labelColor: string) => ({
      plugins: {
        title: {
          display: true,
          color: labelColor,
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
            color: labelColor,
          },
          ticks: {
            color: labelColor,
          },
        },
        x: {
          ticks: {
            color: labelColor,
          },
        },
      },
    }),
  },
});
