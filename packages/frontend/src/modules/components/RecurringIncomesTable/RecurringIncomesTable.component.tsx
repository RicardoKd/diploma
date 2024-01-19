import React, { useCallback } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQuery } from 'react-query';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';

import { Typography } from '@mui/material';
import { Table } from '../../UI/Table';
import { QUERY_KEYS } from '../../constants';
import queryClient from '../../app/queryClient';
import { transactionService } from '../../services';
import { IAlertState, ICategory, IRecurringTransaction } from '../../types';
import { SPACES } from '../../theme';

interface IRecurringIncomesTableProps {
  accountId: string;
}

export const RecurringIncomesTable: React.FC<IRecurringIncomesTableProps> = ({ accountId }) => {
  let rows: any = [];

  const categories = queryClient.getQueryData<ICategory[]>([QUERY_KEYS.INCOME_CATEGORIES]);

  const {
    isSuccess,
    isLoading,
    data: reccuringIncomes
  } = useQuery<IRecurringTransaction[]>({
    keepPreviousData: true,
    queryKey: [QUERY_KEYS.RECURRING_INCOMES, accountId],
    queryFn: () => transactionService.getRecurringTransactions('income', accountId)
  });

  const onChangeSuccess = () => {
    queryClient.invalidateQueries([QUERY_KEYS.RECURRING_INCOMES, accountId]);
  };

  const updateMutation = useMutation(
    transactionService.updateRecurringTransaction.bind(transactionService),
    {
      onSuccess: () => onChangeSuccess(),
      onError: () => {
        queryClient.setQueryData<IAlertState>(QUERY_KEYS.ALERT_STACK, {
          isOpen: true,
          severity: 'error',
          message: 'Failed to update recurring income'
        });
      }
    }
  );

  const handleUpdate = useCallback((newRow: any) => {
    updateMutation.mutate({ ...newRow, type: 'income' });

    return newRow;
  }, []);

  const deleteMutation = useMutation(transactionService.deleteById.bind(transactionService), {
    onSuccess: () => onChangeSuccess(),
    onError: () => {
      queryClient.setQueryData<IAlertState>(QUERY_KEYS.ALERT_STACK, {
        isOpen: true,
        severity: 'error',
        message: 'Failed to delete recurring income'
      });
    }
  });

  const handleDelete = useCallback(
    ({ _id }: any) =>
      () =>
        deleteMutation.mutate({ table: 'recurring_income', id: _id }),
    []
  );

  if (isSuccess) {
    rows = reccuringIncomes.map((transaction, id) => ({
      ...transaction,
      category: transaction.category.id,
      time_gap_type: transaction.time_gap_type.id
    }));
  }

  const columns: GridColDef[] = [
    {
      flex: 0.6,
      type: 'number',
      editable: true,
      field: 'amount_of_money',
      headerName: 'Amount of money'
    },
    {
      flex: 0.5,
      type: 'date',
      editable: true,
      field: 'start_date',
      headerName: 'Start date'
    },
    {
      flex: 0.5,
      type: 'date',
      editable: true,
      field: 'end_date',
      headerName: 'End date'
    },
    {
      flex: 0.5,
      editable: true,
      field: 'category',
      type: 'singleSelect',
      headerName: 'Category',
      valueOptions: categories!,
      getOptionValue: (value: any) => value._id,
      getOptionLabel: (value: any) => value.title
    },
    {
      flex: 1,
      editable: true,
      field: 'notes',
      headerName: 'Notes'
    },
    {
      flex: 1,
      editable: true,
      field: 'time_gap_type_value',
      headerName: 'Time gap type value'
    },
    {
      flex: 0.5,
      editable: true,
      type: 'singleSelect',
      field: 'time_gap_type',
      headerName: 'Time gap type',
      valueOptions: [
        { label: 'day', value: 1 },
        { label: 'week', value: 2 },
        { label: 'month', value: 3 },
        { label: 'year', value: 4 }
      ]
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
      <Typography variant="h6" component="h4" sx={{ marginBottom: SPACES.l }}>
        Recurring incomes
      </Typography>
      <Table rows={rows} isLoading={isLoading} columns={columns} handleUpdate={handleUpdate} />
    </>
  );
};
