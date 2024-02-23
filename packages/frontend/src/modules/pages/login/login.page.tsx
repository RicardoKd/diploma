import React from 'react';
import { useFormik } from 'formik';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField } from '@mui/material';

import { userService } from '../../services';
import { ROUTER_KEYS } from '../../constants';
import { LoginFormItems } from './LoginFormItems';
import { FormikLoginForm } from './FormikLoginForm';
import { BORDER_RADIUS, SPACES } from '../../theme';
import { validationSchema } from './validationSchema';
import { AppButton, FlexContainer, ThemeToggle } from '../../UI';
import { formatLabel, logOut, showError, showSuccess } from '../../utils';

export const LoginPage = () => {
  logOut();

  const navigate = useNavigate();
  const formik = useFormik({
    validationSchema,
    initialValues: new FormikLoginForm(),
    onSubmit: (values) => createMutation.mutate(values),
  });
  const createMutation = useMutation(
    userService.login.bind(userService).bind(userService),
    {
      onSuccess: (data) => {
        showSuccess('Succesfully logged in');
        navigate(ROUTER_KEYS.HOME);
        formik.resetForm();
      },
      onError: () => showError('Failed to log in'),
    }
  );

  const fields = [
    { formItem: LoginFormItems.USER },
    { formItem: LoginFormItems.PASSWORD, type: 'password' },
  ];

  return (
    <FlexContainer sx={{ height: '100vh' }} component='main'>
      <Paper
        sx={{
          display: 'flex',
          overflow: 'hidden',
          alignItems: 'stretch',
          justifyContent: 'stretch',
          borderRadius: BORDER_RADIUS,
          height: { xs: 600, md: 480 },
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            height: { xs: '45%', md: 'unset' },
            padding: { xs: SPACES.m, md: SPACES.xxl },
          }}
          display="flex"
          alignItems="center"
          bgcolor="primary.main"
          justifyContent="center"
          color="primary.contrastText"
        >
          <Typography
            textAlign="center"
            variant="h2"
            sx={{
              fontWeight: 400,
              fontFamily: 'Anta, monospace',
              fontSize: { xs: '3rem', md: '5rem' },
            }}
          >
            Budgeting App
          </Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            width: { xs: '100%', md: '50%' },
            height: { xs: '55%', md: 'unset' },
            padding: { xs: SPACES.m, md: SPACES.xxl },
          }}
        >
          <Box display="flex" justifyContent="end">
            <ThemeToggle />
          </Box>
          <Box
            flexGrow="1"
            display="flex"
            component="form"
            alignItems="center"
            flexDirection="column"
            justifyContent="space-around"
            onSubmit={formik.handleSubmit}
          >
            <Typography variant="h4">Log In</Typography>
            {fields.map(({ formItem, type }, i) => (
              <TextField
                key={i}
                type={type}
                id={formItem}
                name={formItem}
                label={formatLabel(formItem)}
                onChange={formik.handleChange}
                value={formik.values[formItem]}
                error={formik.touched[formItem] && !!formik.errors[formItem]}
                helperText={
                  (formik.touched[formItem] &&
                    formik.errors[formItem]) as React.ReactNode
                }
              />
            ))}
            <AppButton type="submit">Log in</AppButton>
          </Box>
        </Box>
      </Paper>
    </FlexContainer>
  );
};
