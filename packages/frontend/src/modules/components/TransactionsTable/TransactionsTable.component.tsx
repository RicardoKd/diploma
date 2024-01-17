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
  const spendCategories = queryClient.getQueryData<ICategory[]>([
    QUERY_KEYS.SPEND_CATEGORIES,
  ]);
  //   {
  //     value: '1',
  //     label: 'Food',
  //   },
  //   {
  //     value: '2',
  //     label: 'Health',
  //   },
  //   {
  //     value: '3',
  //     label: 'Entertainment',
  //   },
  //   {
  //     value: '4',
  //     label: 'Travel',
  //   },
  //   {
  //     value: '5',
  //     label: 'Vehicle',
  //   },
  //   {
  //     value: '6',
  //     label: 'Online subscription',
  //   },
  //   {
  //     value: '7',
  //     label: 'House',
  //   },
  //   {
  //     value: '8',
  //     label: 'Taxes',
  //   },
  //   {
  //     value: '9',
  //     label: 'Utilities',
  //   },
  //   {
  //     value: '10',
  //     label: 'Legal documents',
  //   },
  //   {
  //     value: '11',
  //     label: 'One-time',
  //   },
  //   {
  //     value: '12',
  //     label: 'Unexpected',
  //   },
  //   {
  //     value: '13',
  //     label: 'Personal',
  //   },
  //   {
  //     value: '14',
  //     label: 'Other',
  //   },
  // ];
  const incomeCategories = queryClient.getQueryData<ICategory[]>([
    QUERY_KEYS.INCOME_CATEGORIES,
  ]);
  //   {
  //     value: '1',
  //     label: 'Salary',
  //   },
  //   {
  //     value: '2',
  //     label: 'Bonus',
  //   },
  //   {
  //     value: '3',
  //     label: 'Interest',
  //   },
  //   {
  //     value: '4',
  //     label: 'Dividends',
  //   },
  //   {
  //     value: '5',
  //     label: 'Rental Income',
  //   },
  //   {
  //     value: '6',
  //     label: 'Gifts',
  //   },
  //   {
  //     value: '7',
  //     label: 'Capital Gains',
  //   },
  //   {
  //     value: '8',
  //     label: 'Self-Employment Income',
  //   },
  //   {
  //     value: '9',
  //     label: 'Other',
  //   },
  //   {
  //     value: '10',
  //     label: 'Social Security',
  //   },
  // ];

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
      onError: () => {
        queryClient.setQueryData<IAlertState>(QUERY_KEYS.ALERT_STACK, {
          isOpen: true,
          severity: 'error',
          message: 'Failed to update transaction',
        });
      },
    }
  );

  const handleUpdate = useCallback((newRow: any) => {
    updateMutation.mutate(newRow);

    return newRow;
  }, []);

  const deleteMutation = useMutation(
    transactionService.deleteById.bind(transactionService),
    {
      onSuccess: () => onChangeSuccess(),
      onError: () => {
        queryClient.setQueryData<IAlertState>(QUERY_KEYS.ALERT_STACK, {
          isOpen: true,
          severity: 'error',
          message: 'Failed to delete transaction',
        });
      },
    }
  );

  const handleDelete = useCallback(
    ({ type, _id }: any) =>
      () =>
        deleteMutation.mutate({ table: type, id: _id }),
    []
  );

  if (transactionsLoaded) {
    rows = transactions.map((transaction, id) => ({
      id: ++id, // IMPORTANT: transaction._id is not used here because spends and incomes might have the same _id
      ...transaction,
      category: transaction.category._id,
    }));
  }

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
      getOptionValue: (value: any) => value._id,
      getOptionLabel: (value: any) => value.title,
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
        rows={rows}
        isLoading={isLoading}
        columns={columns}
        handleUpdate={handleUpdate}
      />
      <RecurringIncomesTable accountId={accountId} />
      <RecurringSpendsTable accountId={accountId} />
    </>
  );
};
