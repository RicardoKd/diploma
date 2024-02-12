export interface IUserStats {
  username: string;
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
