import { IIncomeSpendRangeStats } from '..';

export interface IUserTransactionsRangeStats extends IIncomeSpendRangeStats {
  username: string;
}
