import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container } from '@mui/material';

import { SPACES } from '../../theme';
import { FlexContainer } from '../../UI';
import { QUERY_KEYS } from '../../constants';
import queryClient from '../../app/queryClient';
import {
  Header,
  TransactionsTable,
  CreateTransactionForm,
  RecurringTransactionsTable,
  CreateRecurringTransactionForm,
} from '../../components';

export const AccountPage = () => {
  const accountId = useParams().accountId!;
  queryClient.setQueryData(QUERY_KEYS.CURRENT_ACCOUNT, accountId);

  return (
    <>
      <Header />
      <FlexContainer sx={{ flexDirection: 'column' }} component="main">
        <FlexContainer
          sx={{
            width: '100%',
            marginBottom: SPACES.s,
            justifyContent: 'space-between',
            '> div > *': {
              marginLeft: SPACES.m,
            },
            flexDirection: { xs: 'column', sm: 'row' },
            // alignItems: { xs: 'flex-start', sm: 'center' },
          }}
        >
          <Typography variant="h6" component="h4">
            Transactions
          </Typography>
          <div>
            <CreateTransactionForm type="income" />
            <CreateTransactionForm type="spend" />
          </div>
        </FlexContainer>
        <Container
          disableGutters
          sx={{
            height: 454,
            width: '100%',
            overflowX: 'auto',
            marginBottom: SPACES.xxl,
          }}
        >
          <TransactionsTable />
        </Container>

        <FlexContainer
          sx={{
            width: '100%',
            marginBottom: SPACES.s,
            justifyContent: 'space-between',
            '> div > *': {
              marginLeft: SPACES.m,
            },
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Typography variant="h6" component="h4">
            Recurring Transactions
          </Typography>
          <div>
            <CreateRecurringTransactionForm type="income" />
            <CreateRecurringTransactionForm type="spend" />
          </div>
        </FlexContainer>
        <Container
          disableGutters
          sx={{
            height: 454,
            width: '100%',
            overflowX: 'auto',
            marginBottom: SPACES.xxl,
          }}
        >
          <RecurringTransactionsTable />
        </Container>
      </FlexContainer>
    </>
  );
};
