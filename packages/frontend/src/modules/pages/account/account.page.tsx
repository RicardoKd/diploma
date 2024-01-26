import { Typography } from '@mui/material';

import { SPACES } from '../../theme';
import { MainStyled, TableActionsContainer } from '../../UI';
import {
  TransactionsTable,
  RecurringSpendsTable,
  RecurringIncomesTable,
  CreateTransactionForm,
  CreateRecurringTransactionForm,
} from '../../components';

export const AccountPage = () => {
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
      <RecurringIncomesTable />

      <Typography
        variant="h6"
        component="h4"
        sx={{ marginBottom: SPACES.l, width: '100%' }}
      >
        Recurring spends
      </Typography>
      <RecurringSpendsTable />
    </MainStyled>
  );
};
