import styled from 'styled-components';
import { DataGrid } from '@mui/x-data-grid';

import { ADAPTIVE, COLORS, SPACES } from '../../theme';

export const DataGridStyled = styled(DataGrid)`
  .MuiDataGrid-root,
  .MuiDataGrid-columnHeaders {
    border-radius: 0;
  }

  .MuiDataGrid-columnHeaders {
    background-color: ${COLORS.lightgrey};
  }

  .MuiDataGrid-row:nth-child(2n + 1) {
    background-color: ${COLORS.secondary} !important;
  }

  .MuiDataGrid-row:nth-child(2n) {
    background-color: ${COLORS.secondary} !important;
  }

  .MuiDataGrid-row:hover {
    background-color: unset !important;
  }

  .MuiDataGrid-cell:focus,
  .MuiDataGrid-cell:focus-within,
  .MuiDataGrid-columnHeader:focus {
    outline: none !important;
  }

  .actionCell {
    justify-content: space-between !important;
  }

  .MuiDataGrid-cell {
    min-height: 36px !important;
  }
`;

export const TableActionsContainer = styled('div')`
  width: 100%;
  display: flex;
  max-width: ${ADAPTIVE.max};
  margin-bottom: ${SPACES.s};
  justify-content: space-between;

  > div > * {
    margin-left: ${SPACES.m};
  }
`;

export const TableContainer = styled('div')`
  width: 100%;
  height: 454px;
  max-width: ${ADAPTIVE.max};
  margin-bottom: ${SPACES.xxl};
`;
