import React from 'react';
import { AxiosError } from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQuery } from 'react-query';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';

import { Table } from '../../UI';
import { FormItems } from './FormItems';
import queryClient from '../../app/queryClient';
import { transactionService } from '../../services';
import { ValidationSchema } from './ValidationSchema';
import { ICategory, IRecurringTransaction } from '../../types';
import { currencyFormatter, useAppSnackbar } from '../../utils';
import { QUERY_KEYS, TIME_GAP_TYPES_OPTIONS } from '../../constants';

export const RecurringTransactionsTable = () => {
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
  } = useQuery<IRecurringTransaction[]>({
    keepPreviousData: true,
    queryKey: [QUERY_KEYS.RECURRING_TRANSACTIONS, accountId],
    queryFn: () => transactionService.getRecurringTransactions(accountId),
  });

  const updateMutation = useMutation(
    transactionService.updateRecurringTransaction.bind(transactionService),
    {
      onSuccess: () => showSuccess('Recurring transaction succesfully updated'),
      onError: (err: AxiosError<{ error: string }>) => {
        const errText = err.response?.data.error;
        let message =
          'Failed to update recurring transaction. Please contact the administrator';
        if (errText?.includes('recurring_spend_end_date_check')) {
          message =
            'The end date must be greater than today to update the transaction';
        }
        showError(message);
      },
    }
  );

  const handleUpdate = React.useCallback(
    async (newRow: IRecurringTransaction, oldRow: IRecurringTransaction) => {
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
        showSuccess('Recurring transaction succesfully deleted');
        queryClient.invalidateQueries([
          QUERY_KEYS.RECURRING_TRANSACTIONS,
          accountId,
        ]);
      },
      onError: () => showError('Failed to delete recurring income'),
    }
  );

  const handleDelete = React.useCallback(
    ({ type, id }: IRecurringTransaction) =>
      deleteMutation.mutate({ table: `recurring_${type}`, id }),
    []
  );

  const validateCellUpdate = async (cellName: string, cellValue: any) => {
    let isError = false;
    await ValidationSchema.validateAt(cellName, {
      [cellName]: cellValue,
    }).catch((error) => {
      showError(error.message);
      isError = true;
    });

    return isError;
  };

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
      preProcessEditCellProps: async ({ props, row }) => {
        if (row.type === 'income') {
          props.error = await validateCellUpdate(
            FormItems.amountOfMoney,
            props.value
          );
        }

        return props;
      },
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
      preProcessEditCellProps: async ({ props }) => {
        props.error = await validateCellUpdate(FormItems.endDate, props.value);

        return props;
      },
    },
    {
      flex: 0.5,
      editable: true,
      field: 'category',
      type: 'singleSelect',
      headerName: 'Category',
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
      flex: 1,
      editable: true,
      field: 'notes',
      headerName: 'Notes',
    },
    {
      flex: 0.7,
      type: 'number',
      editable: true,
      field: 'time_gap_type_value',
      headerName: 'Time gap type value',
      preProcessEditCellProps: async ({ props }) => {
        props.error = await validateCellUpdate(
          FormItems.timeGapTypeValue,
          props.value
        );

        return props;
      },
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
          label="Delete"
          icon={<DeleteIcon />}
          onClick={() => handleDelete(params.row)}
        />,
      ],
    },
  ];

  return (
    <Table
      isLoading={isLoading}
      sx={{ minWidth: 1000 }}
      handleUpdate={handleUpdate}
      rows={transactionsLoaded ? transactions : []}
      columns={columns}
    />
  );
};
