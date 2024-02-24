import * as Yup from 'yup';

import { FormItems } from './FormItems';

export const ValidationSchema = Yup.object({
  [FormItems.USER]: Yup.string().required('Required'),
  [FormItems.PASSWORD]: Yup.string()
    .min(4, 'Password should be of minimum 4 characters length')
    .required('Required'),
  [FormItems.CONFIRM_PASSWORD]: Yup.string()
    .equals([Yup.ref(FormItems.PASSWORD)], 'Passwords do not match')
    .required('Required'),
});
