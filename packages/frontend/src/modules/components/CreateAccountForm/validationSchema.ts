import * as Yup from 'yup';

import { FormItems } from './FormItems';

export const ValidationSchema = Yup.object({
  [FormItems.TITLE]: Yup.string().required('Required'),
});
