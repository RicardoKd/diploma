import React from 'react';

import { SPACES } from '../../theme';
import { AppButton } from '../../UI';
import { userService } from '../../services';
import { validationSchema } from './validationSchema';
import { AddChildFormItems } from './AddChildFormItems';
import { FormikAddChildForm } from './FormikAddChildForm';
import { DialogForm } from '../DialogForm/DialogForm.component';

export const AddChildForm = () => {
  const [isOpen, setOpen] = React.useState(false);

  return (
    <>
      <AppButton
        text={`Add Child`}
        onClick={() => setOpen(true)}
        style={{ marginRight: SPACES.m }}
      />
      <DialogForm
        isOpen={isOpen}
        formName="Add child"
        errorMessage="Failed to add child"
        handleClose={() => setOpen(false)}
        validationSchema={validationSchema}
        successMessage="Child added successfully"
        initialValues={new FormikAddChildForm()}
        serviceMethod={userService.createChild.bind(userService)}
        fields={[
          { formItem: AddChildFormItems.USER },
          { formItem: AddChildFormItems.PASSWORD },
          { formItem: AddChildFormItems.CONFIRM_PASSWORD },
        ]}
      />
    </>
  );
};
