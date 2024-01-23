import React from 'react';

import { SPACES } from '../../theme';
import { AppButton } from '../../UI';
import { QUERY_KEYS } from '../../constants';
import { accountService } from '../../services';
import queryClient from '../../app/queryClient';
import { DialogForm } from '../DialogForm/DialogForm.component';
import { validationSchema } from './validationSchema';
import { CreateAccountFormItems } from './CreateAccountFormItems';
import { FormikCreateAccountForm } from './FormikCreateAccountForm';

export const CreateAccountForm = () => {
  const [isOpen, setOpen] = React.useState(false);

  return (
    <>
      <AppButton
        text="Create account"
        onClick={() => setOpen(true)}
        style={{ marginRight: SPACES.m }}
      />
      <DialogForm
        isOpen={isOpen}
        formName="Create account"
        handleClose={() => setOpen(false)}
        validationSchema={validationSchema}
        errorMessage="Failed to create account"
        successMessage="Account create successfully"
        initialValues={new FormikCreateAccountForm()}
        fields={[{ formItem: CreateAccountFormItems.TITLE }]}
        serviceMethod={accountService.createAccount.bind(accountService)}
        successCallback={() => {
          queryClient.refetchQueries([QUERY_KEYS.ACCOUNTS]);
        }}
      />
    </>
  );
};
