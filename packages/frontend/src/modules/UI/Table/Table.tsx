import React from 'react';
import { GridColDef } from '@mui/x-data-grid';

import { MUI } from '../../theme';
import { DataGridStyled } from './Table.styled';

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
    <DataGridStyled
      rows={rows}
      autoPageSize
      logLevel="error"
      columns={columns}
      loading={isLoading}
      density={MUI.density}
      disableColumnSelector
      hideFooterSelectedRowCount
      disableRowSelectionOnClick
      getRowHeight={getRowHeight}
      processRowUpdate={handleUpdate}
      onProcessRowUpdateError={(error) => {
        throw new Error(error);
      }}
    />
  );
};
