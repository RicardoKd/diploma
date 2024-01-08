export interface IQueryResponse<T> {
  rows: T[];
  rowCount: number;
  command: string;
  fields: {
    name: string;
    tableID: number;
    format: string;
  }[];
}
