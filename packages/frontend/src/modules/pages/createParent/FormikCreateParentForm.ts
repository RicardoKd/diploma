import { CreateChildFormItems } from './CreateParentFormItems';

export class FormikCreateParentForm {
  [CreateChildFormItems.USER]: string = '';

  [CreateChildFormItems.PASSWORD]: string = '';

  [CreateChildFormItems.CONFIRM_PASSWORD]: string = '';
}
