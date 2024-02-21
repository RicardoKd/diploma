import React from 'react';
import { useMutation, useQuery } from 'react-query';

import { Table } from '../../UI';
import queryClient from '../../app/queryClient';
import { transactionService } from '../../services';
import { showError, showSuccess } from '../../utils';
import { ICategory, IRecurringTransaction } from '../../types';
import {
  QUERY_KEYS,
  GET_RECURRING_TRANSACTIONS_TABLE_COLUMN_DEFINITIONS,
} from '../../constants';

export const RecurringTransactionsTable = () => {
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

  const onChangeSuccess = (message: string) => {
    showSuccess(message);
    queryClient.invalidateQueries([
      QUERY_KEYS.RECURRING_TRANSACTIONS,
      accountId,
    ]);
  };

  const updateMutation = useMutation(
    transactionService.updateRecurringTransaction.bind(transactionService),
    {
      onSuccess: () =>
        onChangeSuccess('Recurring transaction succesfully updated'),
      onError: () => showError('Failed to update recurring transaction'),
    }
  );

  const handleUpdate = React.useCallback(
    async (newRow: IRecurringTransaction, oldRow: IRecurringTransaction) => {
      const isSuccess = await updateMutation.mutateAsync(newRow);

      return isSuccess ? newRow : oldRow;
    },
    []
  );

  const deleteMutation = useMutation(
    transactionService.deleteById.bind(transactionService),
    {
      onSuccess: () =>
        onChangeSuccess('Recurring transaction succesfully deleted'),
      onError: () => showError('Failed to delete recurring income'),
    }
  );

  const handleDelete = React.useCallback(
    ({ type, id }: IRecurringTransaction) =>
      deleteMutation.mutate({ table: `recurring_${type}`, id }),
    []
  );

  React.useEffect(() => {
    if (updateMutation.isError) {
      const errMessage: string = (updateMutation.error as any).response.data
        .error;
      if (
        errMessage.includes(
          'violates check constraint "recurring_income_end_date_check"'
        )
      ) {
        showError('End date must be greater ');
      }
    }
  }, [updateMutation.isError]);

  return (
    <Table
      rows={transactionsLoaded ? transactions : []}
      isLoading={isLoading}
      columns={GET_RECURRING_TRANSACTIONS_TABLE_COLUMN_DEFINITIONS({
        handleDelete,
        spendCategories,
        incomeCategories,
      })}
      handleUpdate={handleUpdate}
    />
  );
};
