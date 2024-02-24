import * as Yup from 'yup';

import { FormItems } from './FormItems';

export const ValidationSchema = Yup.object({
  [FormItems.NOTES]: Yup.string(),
  [FormItems.END_DATE]: Yup.date().required('Required'),
  [FormItems.CATEGORY]: Yup.string().required('Required'),
  [FormItems.START_DATE]: Yup.date().required('Required'),
  [FormItems.TIME_GAP_TYPE]: Yup.string().required('Required'),
  [FormItems.AMOUNT_OF_MONEY]: Yup.number()
    .positive('Must be greater than 0')
    .required('Required'),
  [FormItems.TIME_GAP_TYPE_VALUE]: Yup.number()
    .integer('Only whole numbers allowed')
    .positive('Must be greater than 0')
    .required('Required'),
});
