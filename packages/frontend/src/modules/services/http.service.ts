import axios, { AxiosResponse } from 'axios';

import { SERVER_URL } from '../constants';
import { IQueryResponse, IServiceResponse } from '../types';

export default class HttpService {
  constructor(private baseUrl = SERVER_URL) {}

  protected getFullApiUrl(url: string) {
    return `${this.baseUrl}/${url}`;
  }

  protected async handleResponse<T>({
    data,
    status,
    statusText,
  }: AxiosResponse<T>): Promise<T> {
    if (status !== 200) {
      throw new Error(statusText);
    }

    return data;
  }

  async get<T>(url: string): Promise<T> {
    const response = await axios.get<T>(this.getFullApiUrl(url));

    return this.handleResponse<T>(response);
  }

  async post<T>(url: string, data?: {}): Promise<T> {
    const response = await axios.post<T>(this.getFullApiUrl(url), data);

    return this.handleResponse<T>(response);
  }

  async put<T>(url: string, data?: {}): Promise<T> {
    const response = await axios.put<T>(this.getFullApiUrl(url), data);

    return this.handleResponse<T>(response);
  }

  async delete<T>(url: string, data?: {}): Promise<T> {
    const response = await axios.delete<T>(this.getFullApiUrl(url), { data });

    return this.handleResponse<T>(response);
  }

  protected async handleResponse_test<T>(
    asyncFunction: () => Promise<AxiosResponse<IQueryResponse<T>>>
  ): Promise<IServiceResponse<T>> {
    try {
      const res = await asyncFunction();
      return { res, err: null };
    } catch (err: any) {
      console.error('Error in service occured', err);
      return { res: null, err };
    }
  }

  async post_test<T>(url: string, data?: {}): Promise<IServiceResponse<T>> {
    const response = await this.handleResponse_test(async () =>
      axios.post<IQueryResponse<T>>(this.getFullApiUrl(url), data)
    );

    return response;
  }
}
