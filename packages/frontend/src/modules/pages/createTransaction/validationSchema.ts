import * as Yup from 'yup';

import { CreateTransactionFormItems } from './CreateTransactionFormItems';

export const validationSchema = Yup.object({
  [CreateTransactionFormItems.NOTES]: Yup.string().required('Required'),
  [CreateTransactionFormItems.CATEGORY]: Yup.string().required('Required'),
  [CreateTransactionFormItems.RECORD_DATE]: Yup.date()
    .max(new Date(Date.now()), 'Date cannot be in the future')
    .required('Required'),
  [CreateTransactionFormItems.AMOUNT_OF_MONEY]: Yup.number().required('Required')
});
