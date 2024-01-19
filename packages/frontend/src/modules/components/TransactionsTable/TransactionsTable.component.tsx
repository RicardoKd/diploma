import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQuery } from 'react-query';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';

import { Table } from '../../UI/Table';
import { QUERY_KEYS } from '../../constants';
import queryClient from '../../app/queryClient';
import { transactionService } from '../../services';
import { ICategory, ITransaction } from '../../types';
import { currencyFormatter, showError } from '../../utils';
import { RecurringSpendsTable } from '../RecurringSpendsTable';
import { RecurringIncomesTable } from '../RecurringIncomesTable';

export const TransactionsTable = () => {
  const accountId = useParams().accountId!;
  const spendCategories = queryClient.getQueryData<ICategory[]>([
    QUERY_KEYS.SPEND_CATEGORIES,
  ]);
  const incomeCategories = queryClient.getQueryData<ICategory[]>([
    QUERY_KEYS.INCOME_CATEGORIES,
  ]);

  // TODO: why set accountId here if it is in the params?
  // TODO: Maybe use account name in the params?
  queryClient.setQueryData(QUERY_KEYS.CURRENT_ACCOUNT, accountId);

  const {
    isLoading,
    data: transactions,
    isSuccess: transactionsLoaded,
  } = useQuery<ITransaction[]>({
    keepPreviousData: true,
    queryKey: [QUERY_KEYS.TRANSACTIONS, accountId],
    queryFn: () => transactionService.getTransactions(accountId),
  });

  const onChangeSuccess = () => {
    queryClient.invalidateQueries(QUERY_KEYS.ACCOUNTS);
    queryClient.invalidateQueries(QUERY_KEYS.TRANSACTIONS);
    queryClient.refetchQueries([QUERY_KEYS.SPEND_STATS, accountId]);
    queryClient.refetchQueries([QUERY_KEYS.INCOME_STATS, accountId]);
  };

  const updateMutation = useMutation(
    transactionService.updateTransaction.bind(transactionService),
    {
      onSuccess: () => onChangeSuccess(),
      onError: () => showError('Failed to update transaction'),
    }
  );

  const handleUpdate = useCallback(
    (newRow: ITransaction, _oldRow: ITransaction) => {
      // TODO: handle failure and return oldRow
      updateMutation.mutate(newRow);

      return newRow;
    },
    []
  );

  const deleteMutation = useMutation(
    transactionService.deleteById.bind(transactionService),
    {
      onSuccess: () => onChangeSuccess(),
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
      // eslint-disable-next-line no-confusing-arrow
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
    <>
      <Table
        rows={transactionsLoaded ? transactions : []}
        columns={columns}
        isLoading={isLoading}
        handleUpdate={handleUpdate}
      />
      <RecurringIncomesTable accountId={accountId} />
      <RecurringSpendsTable accountId={accountId} />
    </>
  );
};
