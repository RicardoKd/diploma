import React from 'react';
import { useNavigate } from 'react-router-dom';

import { logOut } from '../../utils';
import { MainStyled } from '../../UI';
import { Form } from '../../components';
import { userService } from '../../services';
import { ROUTER_KEYS } from '../../constants';
import { LoginFormItems } from './LoginFormItems';
import { FormikLoginForm } from './FormikLoginForm';
import { validationSchema } from './validationSchema';

export const LoginPage = () => {
  logOut();
  const navigate = useNavigate();

  return (
    <MainStyled>
      <Form
        formName="Log In"
        errorMessage="Failed to log in"
        backButtonNav={ROUTER_KEYS.START}
        validationSchema={validationSchema}
        initialValues={new FormikLoginForm()}
        successMessage="Succesfully logged in"
        successCallback={() => {
          navigate(ROUTER_KEYS.HOME);
        }}
        serviceMethod={userService.login.bind(userService)}
        fields={[
          { formItem: LoginFormItems.USER },
          { formItem: LoginFormItems.PASSWORD, type: 'password' },
        ]}
      />
    </MainStyled>
  );
};
