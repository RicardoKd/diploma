import React from 'react';

import { MainStyled } from '../../UI';
import { userService } from '../../services';
import { validationSchema } from './validationSchema';
import { Form } from '../../components/Form/Form.component';
import { CreateChildFormItems } from './CreateParentFormItems';
import { FormikCreateParentForm } from './FormikCreateParentForm';

export const CreateParentPage = () => (
  <MainStyled>
    <Form
      formName="Add parent"
      errorMessage="Failed to add parent"
      validationSchema={validationSchema}
      successMessage="Parent added successfully"
      initialValues={new FormikCreateParentForm()}
      // eslint-disable-next-line react/jsx-no-bind
      serviceMethod={userService.createParent.bind(userService)}
      fields={[
        { formItem: CreateChildFormItems.USER },
        { formItem: CreateChildFormItems.PASSWORD },
        { formItem: CreateChildFormItems.CONFIRM_PASSWORD }
      ]}
    />
  </MainStyled>
);
