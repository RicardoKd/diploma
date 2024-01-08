import { QueryClient } from 'react-query';

import { QUERY_CLIENT_CONFIG } from '../constants';

const queryClient = new QueryClient(QUERY_CLIENT_CONFIG);

export default queryClient;
