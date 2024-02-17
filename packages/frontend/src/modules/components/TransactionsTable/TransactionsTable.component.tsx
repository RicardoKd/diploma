import React from 'react';
import { useMutation, useQuery } from 'react-query';

import { Table } from '../../UI';
import queryClient from '../../app/queryClient';
import { transactionService } from '../../services';
import { showError, showSuccess } from '../../utils';
import { ICategory, ITransaction } from '../../types';
import {
  QUERY_KEYS,
  GET_TRANSACTIONS_TABLE_COLUMN_DEFINITIONS,
} from '../../constants';

export const TransactionsTable = () => {
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

  const onChangeSuccess = (message: string) => {
    showSuccess(message);
    queryClient.refetchQueries([QUERY_KEYS.TRANSACTIONS, accountId]);
  };

  const updateMutation = useMutation(
    transactionService.updateTransaction.bind(transactionService),
    {
      onSuccess: () => onChangeSuccess('Transaction succesfully updated'),
      onError: () => showError('Failed to update transaction'),
    }
  );

  React.useEffect(() => {
    if (updateMutation.isError) {
      showError((updateMutation.error as any).response.data.error);
    }
  }, [updateMutation.isError]);

  const handleUpdate = React.useCallback(
    async (newRow: ITransaction, oldRow: ITransaction) => {
      const isSuccess = await updateMutation.mutateAsync(newRow);

      return isSuccess ? newRow : oldRow;
    },
    []
  );

  const deleteMutation = useMutation(
    transactionService.deleteById.bind(transactionService),
    {
      onSuccess: () => onChangeSuccess('Transaction succesfully deleted'),
      onError: () => showError('Failed to delete transaction'),
    }
  );

  const handleDelete = React.useCallback(
    ({ type, id }: ITransaction) => deleteMutation.mutate({ table: type, id }),
    []
  );

  return (
    <Table
      rows={transactionsLoaded ? transactions : []}
      columns={GET_TRANSACTIONS_TABLE_COLUMN_DEFINITIONS({
        handleDelete,
        spendCategories,
        incomeCategories,
      })}
      isLoading={isLoading}
      handleUpdate={handleUpdate}
    />
  );
};
