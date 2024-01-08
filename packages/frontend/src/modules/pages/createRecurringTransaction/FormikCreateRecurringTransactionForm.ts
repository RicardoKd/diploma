import { CreateRecurringIncomeFormItems } from './CreateRecurringTransactionFormItems';

export class FormikCreateRecurringTransactionForm {
  [CreateRecurringIncomeFormItems.NOTES]: string = '';

  [CreateRecurringIncomeFormItems.CATEGORY]: string = '';

  [CreateRecurringIncomeFormItems.END_DATE]: string = '';

  [CreateRecurringIncomeFormItems.START_DATE]: string = '';

  [CreateRecurringIncomeFormItems.TIME_GAP_TYPE]: string = '';

  [CreateRecurringIncomeFormItems.AMOUNT_OF_MONEY]: string = '';

  [CreateRecurringIncomeFormItems.TIME_GAP_TYPE_VALUE]: string = '';
}
