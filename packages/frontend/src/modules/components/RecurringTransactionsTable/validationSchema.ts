import * as Yup from 'yup';

import { FormItems } from './FormItems';

export const validationSchema = Yup.object().shape({
  [FormItems.endDate]: Yup.date()
    .min(new Date(), 'End date must be in the future or today')
    .required('End date is a required field'),
  [FormItems.amountOfMoney]: Yup.number()
    .positive('Amount of money must be a positive number')
    .required('Amount of money is a required field'),
  [FormItems.timeGapTypeValue]: Yup.number()
    .integer('Time gap type value must be an integer')
    .positive('Time gap type value must be a positive number')
    .required('Time gap type value is a required field'),
});
