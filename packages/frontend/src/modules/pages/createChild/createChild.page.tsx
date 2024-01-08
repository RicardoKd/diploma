import React from 'react';

import { MainStyled } from '../../UI';
import { userService } from '../../services';
import { validationSchema } from './validationSchema';
import { Form } from '../../components/Form/Form.component';
import { CreateChildFormItems } from './CreateChildFormItems';
import { FormikCreateChildForm } from './FormikCreateChildForm';

export const CreateChildPage = () => (
  <MainStyled>
    <Form
      formName="Add child"
      errorMessage="Failed to add child"
      validationSchema={validationSchema}
      successMessage="Child added successfully"
      initialValues={new FormikCreateChildForm()}
      // eslint-disable-next-line react/jsx-no-bind
      serviceMethod={userService.createChild.bind(userService)}
      fields={[
        { formItem: CreateChildFormItems.USER },
        { formItem: CreateChildFormItems.PASSWORD },
        { formItem: CreateChildFormItems.CONFIRM_PASSWORD }
      ]}
    />
  </MainStyled>
);
