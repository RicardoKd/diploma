import * as Yup from 'yup';

import { AddChildFormItems } from './AddChildFormItems';

export const validationSchema = Yup.object({
  [AddChildFormItems.USER]: Yup.string().required('Required'),
  [AddChildFormItems.PASSWORD]: Yup.string()
    .min(4, 'Password should be of minimum 4 characters length')
    .required('Required'),
  [AddChildFormItems.CONFIRM_PASSWORD]: Yup.string()
    .equals([Yup.ref(AddChildFormItems.PASSWORD)], 'Passwords do not match')
    .required('Required'),
});
