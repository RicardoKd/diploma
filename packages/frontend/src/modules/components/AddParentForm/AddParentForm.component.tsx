import React from 'react';

import { DialogForm } from '../';
import { userService } from '../../services';
import { validationSchema } from './validationSchema';
import { AddParentFormItems } from './AddParentFormItems';
import { FormikAddParentForm } from './FormikAddParentForm';

interface AddParentFormProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddParentForm: React.FC<AddParentFormProps> = ({
  isOpen,
  setOpen,
}) => (
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
);
