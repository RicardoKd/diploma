import { AxiosResponse } from 'axios';
import { IQueryResponse } from '.';

export interface IServiceResponse<T = any> {
  res: AxiosResponse<IQueryResponse<T>> | null;
  err: Error | null;
}
