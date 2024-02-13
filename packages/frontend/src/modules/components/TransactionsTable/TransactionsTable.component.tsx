import React, { useCallback, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQuery } from 'react-query';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';

import { Table } from '../../UI';
import { QUERY_KEYS } from '../../constants';
import queryClient from '../../app/queryClient';
import { transactionService } from '../../services';
import { ICategory, ITransaction } from '../../types';
import { currencyFormatter, showError, showSuccess } from '../../utils';

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

  useEffect(() => {
    if (updateMutation.isError) {
      showError(
        (updateMutation.error as any).response.data.error
      );
      console.log(updateMutation.error);
    }
  }, [updateMutation.isError]);

  const handleUpdate = useCallback(
    async (newRow: ITransaction, oldRow: ITransaction) => {
      console.log('before update transaction');
      const isSuccess = await updateMutation.mutateAsync(newRow);
      console.log('after update transaction');

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

  const handleDelete = useCallback(
    ({ type, id }: ITransaction) =>
      () =>
        deleteMutation.mutate({ table: type, id }),
    []
  );

  const columns: GridColDef[] = [
    {
      field: 'type',
      headerName: 'Type',
    },
    {
      flex: 0.5,
      type: 'number',
      editable: true,
      field: 'amount_of_money',
      headerName: 'Amount of money',
      valueFormatter: ({ value }) => currencyFormatter.format(value),
    },
    {
      flex: 0.5,
      type: 'date',
      editable: true,
      headerName: 'Date',
      field: 'record_date',
    },
    {
      flex: 0.5,
      editable: true,
      field: 'category',
      type: 'singleSelect',
      headerName: 'Category',
      // getOptionValue: (value: any) => value.id, // left as a reference
      // getOptionLabel: (value: any) => value.title, // left as a reference
      valueGetter: ({ row }) => row.category.id,
      valueSetter: ({ row, value }) => {
        row.category.id = value;

        return row;
      },
      valueOptions: ({ row }) =>
        row && row.type === 'income'
          ? incomeCategories || []
          : spendCategories || [],
    },
    {
      flex: 1.5,
      field: 'notes',
      editable: true,
      headerName: 'Notes',
    },
    {
      type: 'actions',
      field: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          label="Delete"
          icon={<DeleteIcon />}
          onClick={handleDelete(params.row)}
        />,
      ],
    },
  ];

  return (
    <Table
      rows={transactionsLoaded ? transactions : []}
      columns={columns}
      isLoading={isLoading}
      handleUpdate={handleUpdate}
    />
  );
};
