import { Typography } from '@mui/material';

import { SPACES } from '../../theme';
import { MainStyled, TableActionsContainer } from '../../UI';
import {
  TransactionsTable,
  RecurringTransactionsTable,
  CreateTransactionForm,
  CreateRecurringTransactionForm,
} from '../../components';
import { useParams } from 'react-router-dom';
import queryClient from '../../app/queryClient';
import { QUERY_KEYS } from '../../constants';

export const AccountPage = () => {
  const accountId = useParams().accountId!;
  queryClient.setQueryData(QUERY_KEYS.CURRENT_ACCOUNT, accountId);

  return (
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
      <TransactionsTable />

      <TableActionsContainer>
        <Typography variant="h6" component="h4">
          Recurring Transactions
        </Typography>
        <div>
          <CreateRecurringTransactionForm type="income" />
          <CreateRecurringTransactionForm type="spend" />
        </div>
      </TableActionsContainer>
      <RecurringTransactionsTable />
    </MainStyled>
  );
};
