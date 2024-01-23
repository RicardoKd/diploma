import * as Yup from 'yup';

import { CreateAccountFormItems } from './CreateAccountFormItems';

export const validationSchema = Yup.object({
  [CreateAccountFormItems.TITLE]: Yup.string().required('Required')
});
