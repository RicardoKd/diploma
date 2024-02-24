import React from 'react';

import { DialogForm } from '../';
import { FormItems } from './FormItems';
import { FormikForm } from './FormikForm';
import { userService } from '../../services';
import { ValidationSchema } from './ValidationSchema';

interface AddChildFormProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddChildForm: React.FC<AddChildFormProps> = ({
  isOpen,
  setOpen,
}) => (
  <DialogForm
    isOpen={isOpen}
    formName="Add child"
    errorMessage="Failed to add child"
    handleClose={() => setOpen(false)}
    validationSchema={ValidationSchema}
    successMessage="Child added successfully"
    initialValues={new FormikForm()}
    serviceMethod={userService.createChild.bind(userService)}
    fields={[
      { formItem: FormItems.USER },
      { formItem: FormItems.PASSWORD },
      { formItem: FormItems.CONFIRM_PASSWORD },
    ]}
  />
);
