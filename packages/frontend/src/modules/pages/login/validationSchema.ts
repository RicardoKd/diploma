import * as Yup from 'yup';

import { LoginFormItems } from './LoginFormItems';

export const validationSchema = Yup.object({
  [LoginFormItems.USER]: Yup.string().required('*required'),
  [LoginFormItems.PASSWORD]: Yup.string()
    .min(4, 'Password should be of minimum 4 characters length')
    .required('*required'),
});
