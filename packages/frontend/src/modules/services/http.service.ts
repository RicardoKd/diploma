import axios from 'axios';

import { SERVER_URL } from '../constants';

export default class HttpService {
  constructor(private baseUrl = SERVER_URL) {}

  protected getFullApiUrl(url: string) {
    return `${this.baseUrl}/${url}`;
  }

  async get<T>(url: string): Promise<T> {
    const response = await axios.get<T>(this.getFullApiUrl(url));

    return response.data;
  }

  async post<T>(url: string, data?: {}): Promise<T> {
    const response = await axios.post<T>(this.getFullApiUrl(url), data);

    return response.data;
  }

  async put<T>(url: string, data?: {}): Promise<T> {
    const response = await axios.put<T>(this.getFullApiUrl(url), data);

    return response.data;
  }

  async delete<T>(url: string, data?: {}): Promise<T> {
    const response = await axios.delete<T>(this.getFullApiUrl(url), { data });

    return response.data;
  }
}
