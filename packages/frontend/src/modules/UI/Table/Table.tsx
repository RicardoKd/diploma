import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { MUI } from '../../theme';
import { TableContainer } from './Table.styled';

interface TableProps {
  rows: any[];
  isLoading: boolean;
  columns: GridColDef[];
  handleUpdate: ((newRow: any, oldRow: any) => any) | undefined;
}

export const Table: React.FC<TableProps> = ({ rows, columns, isLoading, handleUpdate }) => (
  <TableContainer>
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
      processRowUpdate={handleUpdate}
      onProcessRowUpdateError={(error) => {
        throw new Error(error);
      }}
    />
  </TableContainer>
);
