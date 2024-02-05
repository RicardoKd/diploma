import React, { useCallback } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQuery } from 'react-query';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';

import { Table } from '../../UI';
import { QUERY_KEYS, TIME_GAP_TYPES_OPTIONS } from '../../constants';
import queryClient from '../../app/queryClient';
import { transactionService } from '../../services';
import { ICategory, IRecurringTransaction } from '../../types';
import { currencyFormatter, showError, showSuccess } from '../../utils';

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

  const handleUpdate = useCallback(
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

  const handleDelete = useCallback(
    ({ type, id }: IRecurringTransaction) =>
      () =>
        deleteMutation.mutate({ table: `recurring_${type}`, id }),
    []
  );

  const columns: GridColDef[] = [
    {
      field: 'type',
      headerName: 'Type',
    },
    {
      flex: 0.6,
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
      field: 'start_date',
      headerName: 'Start date',
    },
    {
      flex: 0.5,
      type: 'date',
      editable: true,
      field: 'end_date',
      headerName: 'End date',
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
      flex: 1,
      editable: true,
      field: 'notes',
      headerName: 'Notes',
    },
    {
      flex: 0.7,
      editable: true,
      field: 'time_gap_type_value',
      headerName: 'Time gap type value',
    },
    {
      flex: 0.5,
      editable: true,
      type: 'singleSelect',
      field: 'time_gap_type',
      headerName: 'Time gap type',
      valueOptions: TIME_GAP_TYPES_OPTIONS,
      valueGetter: ({ row }) => row.time_gap_type.id,
      valueSetter: ({ row, value }) => {
        row.time_gap_type.id = value;

        return row;
      },
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
      isLoading={isLoading}
      columns={columns}
      handleUpdate={handleUpdate}
    />
  );
};
