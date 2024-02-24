import * as Yup from 'yup';

import { FormItems } from './FormItems';

export const ValidationSchema = Yup.object().shape({
  [FormItems.recordDate]: Yup.date()
    .max(new Date(), 'Date can not be in the future')
    .required('Date is a required field'),
  [FormItems.amountOfMoney]: Yup.number()
    .positive('Amount of money must be a positive number')
    .required('Amount of money is a required field'),
});
