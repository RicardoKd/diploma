export interface IAccount {
  _id: number;
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
