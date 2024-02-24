import React from 'react';
import { AxiosError } from 'axios';
import { useMutation, useQuery } from 'react-query';

import { Table } from '../../UI';
import { useAppSnackbar } from '../../utils';
import queryClient from '../../app/queryClient';
import { transactionService } from '../../services';
import { ICategory, IRecurringTransaction } from '../../types';
import {
  QUERY_KEYS,
  GET_RECURRING_TRANSACTIONS_TABLE_COLUMN_DEFINITIONS,
} from '../../constants';

export const RecurringTransactionsTable = () => {
  const { showError, showSuccess } = useAppSnackbar();

  const accountId = queryClient.getQueryData<string>(
    QUERY_KEYS.CURRENT_ACCOUNT
  )!;
  const spendCategories = queryClient.getQueryData<ICategory[]>([
    QUERY_KEYS.SPEND_CATEGORIES,
  ]);
  const incomeCategories = queryClient.getQueryData<ICategory[]>([
    QUERY_KEYS.INCOME_CATEGORIES,
  ]);

  const {
    isLoading,
    data: transactions,
    isSuccess: transactionsLoaded,
  } = useQuery<IRecurringTransaction[]>({
    keepPreviousData: true,
    queryKey: [QUERY_KEYS.RECURRING_TRANSACTIONS, accountId],
    queryFn: () => transactionService.getRecurringTransactions(accountId),
  });

  const updateMutation = useMutation(
    transactionService.updateRecurringTransaction.bind(transactionService),
    {
      onSuccess: () => showSuccess('Recurring transaction succesfully updated'),
      onError: (err: AxiosError<{ error: string }>) => {
        const errText = err.response?.data.error;
        let message =
          'Failed to update recurring transaction. Please contact the administrator';
        if (errText?.includes('recurring_spend_end_date_check')) {
          message =
            'The end date must be greater than today to update the transaction';
        }
        showError(message);
      },
    }
  );

  const handleUpdate = React.useCallback(
    async (newRow: IRecurringTransaction, oldRow: IRecurringTransaction) => {
      let row = newRow;
      await updateMutation.mutateAsync(newRow).catch(() => {
        row = oldRow;
      });

      return row;
    },
    []
  );

  const deleteMutation = useMutation(
    transactionService.deleteById.bind(transactionService),
    {
      onSuccess: () => {
        showSuccess('Recurring transaction succesfully deleted');
        queryClient.invalidateQueries([
          QUERY_KEYS.RECURRING_TRANSACTIONS,
          accountId,
        ]);
      },
      onError: () => showError('Failed to delete recurring income'),
    }
  );

  const handleDelete = React.useCallback(
    ({ type, id }: IRecurringTransaction) =>
      deleteMutation.mutate({ table: `recurring_${type}`, id }),
    []
  );

  return (
    <Table
      isLoading={isLoading}
      sx={{ minWidth: 1000 }}
      handleUpdate={handleUpdate}
      rows={transactionsLoaded ? transactions : []}
      columns={GET_RECURRING_TRANSACTIONS_TABLE_COLUMN_DEFINITIONS({
        handleDelete,
        spendCategories,
        incomeCategories,
      })}
    />
  );
};
