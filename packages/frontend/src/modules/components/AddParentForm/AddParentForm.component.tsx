import React from 'react';

import { DialogForm } from '../';
import { FormItems } from './FormItems';
import { FormikForm } from './FormikForm';
import { userService } from '../../services';
import { ValidationSchema } from './ValidationSchema';

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
    validationSchema={ValidationSchema}
    successMessage="Parent added successfully"
    initialValues={new FormikForm()}
    serviceMethod={userService.createParent.bind(userService)}
    fields={[
      { formItem: FormItems.USER },
      { formItem: FormItems.PASSWORD },
      { formItem: FormItems.CONFIRM_PASSWORD },
    ]}
  />
);
