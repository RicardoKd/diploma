import React from 'react';
import { AxiosError } from 'axios';
import { useMutation, useQuery } from 'react-query';

import { Table } from '../../UI';
import { useAppSnackbar } from '../../utils';
import queryClient from '../../app/queryClient';
import { transactionService } from '../../services';
import { ICategory, ITransaction } from '../../types';
import {
  QUERY_KEYS,
  GET_TRANSACTIONS_TABLE_COLUMN_DEFINITIONS,
} from '../../constants';

export const TransactionsTable = () => {
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
  } = useQuery<ITransaction[]>({
    keepPreviousData: true,
    queryKey: [QUERY_KEYS.TRANSACTIONS, accountId],
    queryFn: () => transactionService.getTransactions(accountId),
  });

  const updateMutation = useMutation(
    transactionService.updateTransaction.bind(transactionService),
    {
      onSuccess: () => showSuccess('Transaction succesfully updated'),
      onError: (err: AxiosError<{ error: string }>) => {
        const errText = err.response?.data.error;
        let message =
          'Failed to update transaction. Please contact the administrator';
        if (
          errText?.includes('Spend amount exceeds income for this account.')
        ) {
          message = errText;
        }
        showError(message);
      },
    }
  );

  const handleUpdate = React.useCallback(
    async (newRow: ITransaction, oldRow: ITransaction) => {
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
        showSuccess('Transaction succesfully deleted');
        queryClient.refetchQueries([QUERY_KEYS.TRANSACTIONS, accountId]);
      },
      onError: () => showError('Failed to delete transaction'),
    }
  );

  const handleDelete = React.useCallback(
    ({ type, id }: ITransaction) => deleteMutation.mutate({ table: type, id }),
    []
  );

  return (
    <Table
      isLoading={isLoading}
      sx={{ minWidth: 1000 }}
      handleUpdate={handleUpdate}
      rows={transactionsLoaded ? transactions : []}
      columns={GET_TRANSACTIONS_TABLE_COLUMN_DEFINITIONS({
        handleDelete,
        spendCategories,
        incomeCategories,
      })}
    />
  );
};
