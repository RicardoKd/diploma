import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { MUI } from '../../theme';

interface TableProps {
  rows: any[];
  isLoading: boolean;
  columns: GridColDef[];
  handleUpdate?: (newRow: any, oldRow: any) => any;
}

export const Table: React.FC<TableProps> = ({
  rows,
  columns,
  isLoading,
  handleUpdate,
}) => {
  const getRowHeight = React.useCallback(() => 'auto', []);

  return (
    <DataGrid
      rows={rows}
      autoPageSize
      logLevel="error"
      columns={columns}
      loading={isLoading}
      density={MUI.density}
      disableColumnSelector
      hideFooterSelectedRowCount
      disableRowSelectionOnClick
      // FIXME: The following line of codd makes the dropdown inputs huge on doubleClick
      getRowHeight={getRowHeight}
      processRowUpdate={handleUpdate}
      onProcessRowUpdateError={(error) => {
        throw new Error(error);
      }}
      sx={{
        '.MuiDataGrid-columnHeaders': {
          backgroundColor: 'secondary.contrastText',
        },
        '.MuiDataGrid-row': {
          backgroundColor: 'primary.contrastText',
        },
        '.MuiDataGrid-row:hover': {
          backgroundColor: 'background.default',
        },
        '.actionCell': {
          justifyContent: 'space-between',
        },
        '.MuiDataGrid-cell': {
          minHeight: '36px !important',
        },
      }}
    />
  );
};
