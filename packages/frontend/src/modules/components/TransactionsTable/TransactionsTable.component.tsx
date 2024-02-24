import React from 'react';
import { AxiosError } from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQuery } from 'react-query';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';

import { Table } from '../../UI';
import { FormItems } from './FormItems';
import { QUERY_KEYS } from '../../constants';
import queryClient from '../../app/queryClient';
import { transactionService } from '../../services';
import { ICategory, ITransaction } from '../../types';
import { ValidationSchema } from './ValidationSchema';
import { currencyFormatter, useAppSnackbar } from '../../utils';

export const TransactionsTable = () => {
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
  } = useQuery<ITransaction[]>({
    keepPreviousData: true,
    queryKey: [QUERY_KEYS.TRANSACTIONS, accountId],
    queryFn: () => transactionService.getTransactions(accountId),
  });

  const updateMutation = useMutation(
    transactionService.updateTransaction.bind(transactionService),
    {
      onSuccess: () => showSuccess('Transaction succesfully updated'),
      onError: (err: AxiosError<{ error: string }>) => {
        const errText = err.response?.data.error;
        let message =
          'Failed to update transaction. Please contact the administrator';
        if (
          errText?.includes('Spend amount exceeds income for this account.')
        ) {
          message = errText;
        }
        showError(message);
      },
    }
  );

  const handleUpdate = React.useCallback(
    async (newRow: ITransaction, oldRow: ITransaction) => {
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
        showSuccess('Transaction succesfully deleted');
        queryClient.refetchQueries([QUERY_KEYS.TRANSACTIONS, accountId]);
      },
      onError: () => showError('Failed to delete transaction'),
    }
  );

  const handleDelete = React.useCallback(
    ({ type, id }: ITransaction) => deleteMutation.mutate({ table: type, id }),
    []
  );

  const validateCellUpdate = async (cellName: string, cellValue: any) => {
    let isError = false;
    console.log({ [cellName]: cellValue });
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
      flex: 0.35,
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
      headerName: 'Date',
      field: 'record_date',
      preProcessEditCellProps: async ({ props }) => {
        props.error = await validateCellUpdate(
          FormItems.recordDate,
          props.value
        );

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
          onClick={() => handleDelete(params.row)}
        />,
      ],
    },
  ];

  return (
    <Table
      columns={columns}
      isLoading={isLoading}
      sx={{ minWidth: 1000 }}
      handleUpdate={handleUpdate}
      rows={transactionsLoaded ? transactions : []}
    />
  );
};
