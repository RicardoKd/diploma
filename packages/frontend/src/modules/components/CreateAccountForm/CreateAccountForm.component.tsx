import React from 'react';

import { DialogForm } from '../';
import { QUERY_KEYS } from '../../constants';
import { accountService } from '../../services';
import queryClient from '../../app/queryClient';
import { validationSchema } from './validationSchema';
import { CreateAccountFormItems } from './CreateAccountFormItems';
import { FormikCreateAccountForm } from './FormikCreateAccountForm';

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
    validationSchema={validationSchema}
    errorMessage="Failed to create account"
    successMessage="Account created successfully"
    initialValues={new FormikCreateAccountForm()}
    fields={[{ formItem: CreateAccountFormItems.TITLE }]}
    serviceMethod={accountService.createAccount.bind(accountService)}
    successCallback={() => {
      queryClient.refetchQueries([QUERY_KEYS.ACCOUNTS]);
    }}
  />
);
