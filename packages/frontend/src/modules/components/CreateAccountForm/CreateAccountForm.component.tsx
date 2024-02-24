import React from 'react';

import { DialogForm } from '../';
import { FormItems } from './FormItems';
import { FormikForm } from './FormikForm';
import { QUERY_KEYS } from '../../constants';
import { accountService } from '../../services';
import queryClient from '../../app/queryClient';
import { ValidationSchema } from './ValidationSchema';

interface CreateAccountFormProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateAccountForm: React.FC<CreateAccountFormProps> = ({
  isOpen,
  setOpen,
}) => (
  <DialogForm
    isOpen={isOpen}
    formName="Create account"
    handleClose={() => setOpen(false)}
    validationSchema={ValidationSchema}
    errorMessage="Failed to create account"
    successMessage="Account created successfully"
    initialValues={new FormikForm()}
    fields={[{ formItem: FormItems.TITLE }]}
    serviceMethod={accountService.createAccount.bind(accountService)}
    successCallback={() => {
      queryClient.refetchQueries([QUERY_KEYS.ACCOUNTS]);
    }}
  />
);
