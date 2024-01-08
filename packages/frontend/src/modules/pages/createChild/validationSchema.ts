import * as Yup from 'yup';

import { CreateChildFormItems } from './CreateChildFormItems';

export const validationSchema = Yup.object({
  [CreateChildFormItems.USER]: Yup.string().required('Required'),
  [CreateChildFormItems.PASSWORD]: Yup.string()
    .min(4, 'Password should be of minimum 4 characters length')
    .required('Required'),
  [CreateChildFormItems.CONFIRM_PASSWORD]: Yup.string()
    .equals([Yup.ref(CreateChildFormItems.PASSWORD)], 'Passwords do not match')
    .required('Required')
});
