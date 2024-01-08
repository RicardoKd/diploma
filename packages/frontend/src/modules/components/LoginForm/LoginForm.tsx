import React from 'react';
import { useNavigate } from 'react-router-dom';

import { userService } from '../../services';
import { Form } from '../Form/Form.component';
import { ROUTER_KEYS } from '../../constants';
import { LoginFormItems } from './LoginFormItems';
import { FormikLoginForm } from './FormikLoginForm';
import { validationSchema } from './validationSchema';

export const LoginForm = () => {
  const navigate = useNavigate();

  return (
    <Form
      formName="Log In"
      errorMessage="Failed to log in"
      validationSchema={validationSchema}
      initialValues={new FormikLoginForm()}
      successMessage="Succesfully logged in"
      successCallback={() => navigate(ROUTER_KEYS.HOME)}
      // eslint-disable-next-line react/jsx-no-bind
      serviceMethod={userService.login.bind(userService)}
      fields={[
        { formItem: LoginFormItems.USER },
        { formItem: LoginFormItems.PASSWORD, type: 'password' }
      ]}
    />
  );
};
