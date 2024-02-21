import React from 'react';

import { DialogForm } from '../';
import { userService } from '../../services';
import { validationSchema } from './validationSchema';
import { AddChildFormItems } from './AddChildFormItems';
import { FormikAddChildForm } from './FormikAddChildForm';

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
);
