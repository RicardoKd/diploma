import {
  TransactionsTable,
  RecurringSpendsTable,
  RecurringIncomesTable,
} from '../../components';

export const AccountPage = () => {
  return (
    <>
      <TransactionsTable />
      <RecurringIncomesTable />
      <RecurringSpendsTable />
    </>
  );
};
