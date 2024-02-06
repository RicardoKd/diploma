export interface IAccount {
  id: string;
  title: string;
  balance: number;
}

export interface IAccount_LEGACY {
  id: string;
  title: string;
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
