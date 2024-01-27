import { ITransactionType } from './';

export interface ITransaction {
  id: string;
  notes: string;
  category: {
    id: string;
    title: string;
  };
  account_id: number;
  record_date: Date;
  amount_of_money: number;
  type: ITransactionType;
}
