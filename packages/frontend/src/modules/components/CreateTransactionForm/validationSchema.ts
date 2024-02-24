import * as Yup from 'yup';

import { FormItems } from './FormItems';

export const ValidationSchema = Yup.object({
  [FormItems.NOTES]: Yup.string(),
  [FormItems.CATEGORY]: Yup.string().required('Required'),
  [FormItems.RECORD_DATE]: Yup.date()
    .max(new Date(Date.now()), 'Date cannot be in the future')
    .required('Required'),
  [FormItems.AMOUNT_OF_MONEY]: Yup.number()
    .positive('Must be greater than 0')
    .required('Required'),
});
