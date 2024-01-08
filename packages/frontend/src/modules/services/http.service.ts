import axios, { AxiosResponse } from 'axios';

import { SERVER_URL } from '../constants';

export default class HttpService {
  constructor(private baseUrl = SERVER_URL) {}

  protected getFullApiUrl(url: string) {
    return `${this.baseUrl}/${url}`;
  }

  protected async handleResponse<T>({ status, statusText, data }: AxiosResponse<T>): Promise<T> {
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
}
