import { CreateTransactionFormItems } from './CreateTransactionFormItems';

export class FormikCreateTransactionForm {
  [CreateTransactionFormItems.NOTES]: string = '';

  [CreateTransactionFormItems.CATEGORY]: string = '';

  [CreateTransactionFormItems.RECORD_DATE]: string = '';

  [CreateTransactionFormItems.AMOUNT_OF_MONEY]: string = '';
}
