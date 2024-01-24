import React, { useCallback } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQuery } from 'react-query';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';

import { Table } from '../../UI';
import { QUERY_KEYS } from '../../constants';
import queryClient from '../../app/queryClient';
import { transactionService } from '../../services';
import { ICategory, ITransaction } from '../../types';
import { RecurringIncomesTable, RecurringSpendsTable } from '../';
import { currencyFormatter, showError, showSuccess } from '../../utils';

export const TransactionsTable = () => {
  const spendCategories = queryClient.getQueryData<ICategory[]>([
    QUERY_KEYS.SPEND_CATEGORIES,
  ]);
  const incomeCategories = queryClient.getQueryData<ICategory[]>([
    QUERY_KEYS.INCOME_CATEGORIES,
  ]);

  const accountId = queryClient.getQueryData<string>(
    QUERY_KEYS.CURRENT_ACCOUNT
  )!;

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
    queryClient.refetchQueries(QUERY_KEYS.ACCOUNTS);
    queryClient.refetchQueries([QUERY_KEYS.TRANSACTIONS, accountId]);
    queryClient.refetchQueries([QUERY_KEYS.SPEND_STATS, accountId]);
    queryClient.refetchQueries([QUERY_KEYS.INCOME_STATS, accountId]);
  };

  const updateMutation = useMutation(
    transactionService.updateTransaction.bind(transactionService),
    {
      onSuccess: (_data, vars) =>
        onChangeSuccess(`${vars.type} succesfully updated`),
      onError: () => showError('Failed to update transaction'),
    }
  );

  const handleUpdate = useCallback(
    async (newRow: ITransaction, oldRow: ITransaction) => {
      // FIXME: when the mutateFn fails, the cell that is being updated remains in the editing state
      const isSuccess = await updateMutation.mutateAsync(newRow);

      return isSuccess ? newRow : oldRow;
    },
    []
  );

  const deleteMutation = useMutation(
    transactionService.deleteById.bind(transactionService),
    {
      onSuccess: (_data, vars) =>
        onChangeSuccess(`${vars.table} succesfully deleted`),
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
      getOptionValue: (value: any) => value.id,
      getOptionLabel: (value: any) => value.title,
      valueGetter: ({ row }) => row.category.id,
      valueSetter: ({ row, value }) => {
        row.category.id = value;

        return row;
      },
      valueOptions: ({ row }) =>
        row && row.type === 'income' ? incomeCategories! : spendCategories!,
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
          icon={<DeleteIcon />}
          label="Delete"
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
