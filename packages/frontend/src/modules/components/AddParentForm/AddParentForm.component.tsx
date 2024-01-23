import React from 'react';

import { SPACES } from '../../theme';
import { AppButton } from '../../UI';
import { userService } from '../../services';
import { validationSchema } from './validationSchema';
import { AddParentFormItems } from './AddParentFormItems';
import { FormikAddParentForm } from './FormikAddParentForm';
import { DialogForm } from '../DialogForm/DialogForm.component';

export const AddParentForm = () => {
  const [isOpen, setOpen] = React.useState(false);

  return (
    <>
      <AppButton
        text="Add 2nd parent"
        onClick={() => setOpen(true)}
      />
      <DialogForm
        isOpen={isOpen}
        formName="Add parent"
        handleClose={() => setOpen(false)}
        errorMessage="Failed to add parent"
        validationSchema={validationSchema}
        successMessage="Parent added successfully"
        initialValues={new FormikAddParentForm()}
        serviceMethod={userService.createParent.bind(userService)}
        fields={[
          { formItem: AddParentFormItems.USER },
          { formItem: AddParentFormItems.PASSWORD },
          { formItem: AddParentFormItems.CONFIRM_PASSWORD },
        ]}
      />
    </>
  );
};
