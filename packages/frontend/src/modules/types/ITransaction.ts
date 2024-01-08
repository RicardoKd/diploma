import { ITransactionType } from './ITransactionType';

export interface ITransaction {
  _id: number;
  notes: string;
  category: {
    _id: number;
    title: string;
  };
  account_id: number;
  record_date: Date;
  amount_of_money: number;
  type: ITransactionType;
}
