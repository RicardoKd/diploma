import * as Yup from 'yup';

import { AddParentFormItems } from './AddParentFormItems';

export const validationSchema = Yup.object({
  [AddParentFormItems.USER]: Yup.string().required('Required'),
  [AddParentFormItems.PASSWORD]: Yup.string()
    .min(4, 'Password should be of minimum 4 characters length')
    .required('Required'),
  [AddParentFormItems.CONFIRM_PASSWORD]: Yup.string()
    .equals([Yup.ref(AddParentFormItems.PASSWORD)], 'Passwords do not match')
    .required('Required'),
});
