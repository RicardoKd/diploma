import React from 'react';

import { MainStyled } from '../../UI';
import { QUERY_KEYS } from '../../constants';
import queryClient from '../../app/queryClient';
import { accountService } from '../../services';
import { validationSchema } from './validationSchema';
import { Form } from '../../components/Form/Form.component';
import { FormikCreateAccountForm } from './FormikCreateAccountForm';
import { CreateAccountFormItems } from './CreateAccountFormItems';

export const CreateAccountPage = () => (
  <MainStyled>
    <Form
      formName="Create account"
      validationSchema={validationSchema}
      errorMessage="Failed to create account"
      successMessage="Account create successfully"
      initialValues={new FormikCreateAccountForm()}
      fields={[{ formItem: CreateAccountFormItems.TITLE }]}
      // eslint-disable-next-line react/jsx-no-bind
      serviceMethod={accountService.createAccount.bind(accountService)}
      successCallback={() => {
        queryClient.refetchQueries([QUERY_KEYS.ACCOUNTS]);
      }}
    />
  </MainStyled>
);
