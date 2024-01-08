import * as Yup from 'yup';

import { CreateRecurringIncomeFormItems } from './CreateRecurringTransactionFormItems';

export const validationSchema = Yup.object({
  [CreateRecurringIncomeFormItems.NOTES]: Yup.string().required('Required'),
  [CreateRecurringIncomeFormItems.END_DATE]: Yup.date().required('Required'),
  [CreateRecurringIncomeFormItems.CATEGORY]: Yup.string().required('Required'),
  [CreateRecurringIncomeFormItems.START_DATE]: Yup.date().required('Required'),
  [CreateRecurringIncomeFormItems.TIME_GAP_TYPE]: Yup.string().required('Required'),
  [CreateRecurringIncomeFormItems.AMOUNT_OF_MONEY]: Yup.number().required('Required'),
  [CreateRecurringIncomeFormItems.TIME_GAP_TYPE_VALUE]: Yup.number()
    .integer('Only whole numbers allowed')
    .positive('Must be greater than 0')
    .required('Required')
});
