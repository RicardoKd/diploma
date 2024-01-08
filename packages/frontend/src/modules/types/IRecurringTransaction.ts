import { ITimeGapType } from './ITimeGapType';

export interface IRecurringTransaction {
  _id: number;
  notes: string;
  end_date: Date;
  start_date: Date;
  account_id: number;
  amount_of_money: number;
  time_gap_type_value: number;
  category: {
    _id: number;
    title: string;
  };
  time_gap_type: {
    _id: number;
    title: ITimeGapType;
  };
}
