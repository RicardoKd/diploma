import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQuery } from 'react-query';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';

import { Table } from '../../UI/Table';
import { QUERY_KEYS } from '../../constants';
import queryClient from '../../app/queryClient';
import { transactionService } from '../../services';
import { RecurringSpendsTable } from '../RecurringSpendsTable';
import { RecurringIncomesTable } from '../RecurringIncomesTable';
import { IAlertState, ICategory, ITransaction } from '../../types';

export const TransactionsTable = () => {
  let rows: any = [];
  const accountId = +useParams().accountId!;
  const spendCategories = queryClient.getQueryData<ICategory[]>([QUERY_KEYS.SPEND_CATEGORIES]);
  const incomeCategories = queryClient.getQueryData<ICategory[]>([QUERY_KEYS.INCOME_CATEGORIES]);

  queryClient.setQueryData(QUERY_KEYS.CURRENT_ACCOUNT, accountId);

  const {
    isLoading,
    data: transactions,
    isSuccess: transactionsLoaded
  } = useQuery<ITransaction[]>({
    keepPreviousData: true,
    queryKey: [QUERY_KEYS.TRANSACTIONS, accountId],
    queryFn: () => transactionService.getTransactions(accountId)
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
      onError: () => {
        queryClient.setQueryData<IAlertState>(QUERY_KEYS.ALERT_STACK, {
          isOpen: true,
          severity: 'error',
          message: 'Failed to update transaction'
        });
      }
    }
  );

  const handleUpdate = useCallback((newRow: any) => {
    updateMutation.mutate(newRow);

    return newRow;
  }, []);

  const deleteMutation = useMutation(transactionService.deleteById.bind(transactionService), {
    onSuccess: () => onChangeSuccess(),
    onError: () => {
      queryClient.setQueryData<IAlertState>(QUERY_KEYS.ALERT_STACK, {
        isOpen: true,
        severity: 'error',
        message: 'Failed to delete transaction'
      });
    }
  });

  const handleDelete = useCallback(
    ({ type, _id }: any) =>
      () =>
        deleteMutation.mutate({ table: type, id: _id }),
    []
  );

  if (transactionsLoaded) {
    rows = transactions.map((transaction, id) => ({
      id,
      ...transaction,
      category: transaction.category._id
    }));
  }

  const columns: GridColDef[] = [
    {
      field: 'type',
      headerName: 'Type'
    },
    {
      flex: 0.5,
      type: 'number',
      editable: true,
      field: 'amount_of_money',
      headerName: 'Amount of money'
    },
    {
      flex: 0.5,
      type: 'date',
      editable: true,
      headerName: 'Date',
      field: 'record_date'
    },
    {
      flex: 0.5,
      editable: true,
      field: 'category',
      type: 'singleSelect',
      headerName: 'Category',
      // eslint-disable-next-line no-confusing-arrow
      valueOptions: ({ row }) =>
        row && row.type === 'income' ? incomeCategories! : spendCategories!,
      getOptionValue: (value: any) => value._id,
      getOptionLabel: (value: any) => value.title
    },
    {
      flex: 1.5,
      field: 'notes',
      editable: true,
      headerName: 'Notes'
    },
    {
      type: 'actions',
      field: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDelete(params.row)}
        />
      ]
    }
  ];

  return (
    <>
      <Table rows={rows} isLoading={isLoading} columns={columns} handleUpdate={handleUpdate} />
      <RecurringIncomesTable accountId={accountId} />
      <RecurringSpendsTable accountId={accountId} />
    </>
  );
};
