import { IAccountStats } from './IAccountStats';

export interface IAccountStatsRange {
  month: IAccountStats[];
  quarter: IAccountStats[];
  year: IAccountStats[];
}
