import { ITimeGapType } from './ITimeGapType';

export interface IRecurringTransaction {
  id: string;
  notes: string;
  end_date: Date;
  start_date: Date;
  account_id: number;
  amount_of_money: number;
  time_gap_type_value: number;
  category: {
    id: string;
    title: string;
  };
  time_gap_type: {
    id: string;
    title: ITimeGapType;
  };
}
