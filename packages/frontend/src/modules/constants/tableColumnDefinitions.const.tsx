import DeleteIcon from '@mui/icons-material/Delete';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';

import { currencyFormatter } from '../utils';
import { ICategory, IRecurringTransaction, ITransaction } from '../types';
import { TIME_GAP_TYPES_OPTIONS } from '.';

export const GET_POPULAR_CATEGORIES_COLUMN_DEFINITIONS = (): GridColDef[] => [
  {
    flex: 0.2,
    field: 'username',
    headerName: 'User',
  },
  {
    flex: 0.5,
    field: 'income',
    headerName: 'Income category',
  },
  {
    flex: 0.5,
    field: 'spend',
    headerName: 'Spend category',
  },
];

export const GET_TRANSACTIONS_TABLE_COLUMN_DEFINITIONS = ({
  handleDelete,
  spendCategories,
  incomeCategories,
}: {
  spendCategories?: ICategory[];
  incomeCategories?: ICategory[];
  handleDelete: (tr: ITransaction) => void;
}): GridColDef[] => [
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
        onClick={() => handleDelete(params.row)}
      />,
    ],
  },
];

export const GET_RECURRING_TRANSACTIONS_TABLE_COLUMN_DEFINITIONS = ({
  handleDelete,
  spendCategories,
  incomeCategories,
}: {
  spendCategories?: ICategory[];
  incomeCategories?: ICategory[];
  handleDelete: (tr: IRecurringTransaction) => void;
}): GridColDef[] => [
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
        label="Delete"
        icon={<DeleteIcon />}
        onClick={() => handleDelete(params.row)}
      />,
    ],
  },
];
