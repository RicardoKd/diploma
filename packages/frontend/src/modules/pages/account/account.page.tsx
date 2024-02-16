import React from 'react';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import { QUERY_KEYS } from '../../constants';
import queryClient from '../../app/queryClient';
import { MainStyled, TableActionsContainer, TableContainer } from '../../UI';
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
      <Header title="Account Details" />
      <MainStyled>
        <TableActionsContainer>
          <Typography variant="h6" component="h4">
            Transactions
          </Typography>
          <div>
            <CreateTransactionForm type="income" />
            <CreateTransactionForm type="spend" />
          </div>
        </TableActionsContainer>
        <TableContainer>
          <TransactionsTable />
        </TableContainer>

        <TableActionsContainer>
          <Typography variant="h6" component="h4">
            Recurring Transactions
          </Typography>
          <div>
            <CreateRecurringTransactionForm type="income" />
            <CreateRecurringTransactionForm type="spend" />
          </div>
        </TableActionsContainer>
        <TableContainer>
          <RecurringTransactionsTable />
        </TableContainer>
      </MainStyled>
    </>
  );
};
