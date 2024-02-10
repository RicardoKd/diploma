import React from 'react';
import { useQuery } from 'react-query';
import { Navigate } from 'react-router-dom';

import { getIsLoggedIn } from '../../utils';
import { QUERY_KEYS, ROUTER_KEYS } from '../../constants';

interface PrivateRouteProps {
  Component: React.ComponentType<any>;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ Component }) => {
  const { isSuccess, data: isLoggedIn } = useQuery<boolean>({
    keepPreviousData: true,
    queryKey: [QUERY_KEYS.IS_LOGGED_IN],
    queryFn: () => {
      return getIsLoggedIn();
    },
  });

  if (!isSuccess) {
    return null;
  }

  return isLoggedIn ? <Component /> : <Navigate to={ROUTER_KEYS.LOGIN} />;
};
