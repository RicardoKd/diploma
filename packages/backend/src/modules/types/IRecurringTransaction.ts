export interface IRecurringTransaction {
  id: string;
  notes: string;
  end_date: Date;
  start_date: Date;
  account_id: string;
  type: 'income' | 'spend';
  amount_of_money: string;
  time_gap_type_value: number;
  time_gap_type_id: number;
  category_id: string;
}
