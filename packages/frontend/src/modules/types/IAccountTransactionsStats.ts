export interface IAccountTransactionsStats {
  id: string;
  income: {
    year: number;
    quarter: number;
    month: number;
  };
  spend: {
    year: number;
    quarter: number;
    month: number;
  };
}
