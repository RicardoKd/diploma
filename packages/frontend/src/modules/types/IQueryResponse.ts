export interface IQueryResponse<T = any> {
  rows: T[];
  rowCount: number;
  command: string;
  fields: {
    name: string;
    tableID: number;
    format: string;
  }[];
}
