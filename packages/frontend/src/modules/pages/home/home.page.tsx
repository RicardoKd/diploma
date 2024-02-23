import React from 'react';
import { useQuery } from 'react-query';
import { Container, CircularProgress } from '@mui/material';

import { IAccount } from '../../types';
import { FlexContainer } from '../../UI';
import { QUERY_KEYS } from '../../constants';
import { accountService } from '../../services';
import { Header, AccountCard } from '../../components';

export const HomePage = () => {
  const { isSuccess, data: accounts } = useQuery<IAccount[]>({
    keepPreviousData: true,
    refetchOnMount: 'always',
    queryKey: [QUERY_KEYS.ACCOUNTS],
    queryFn: () => accountService.getAccounts(),
  });

  return (
    <>
      <Header title="Accounts" />
      <Container component="main">
        <FlexContainer sx={{ flexWrap: 'wrap' }}>
          {isSuccess ? (
            accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))
          ) : (
            <CircularProgress />
          )}
        </FlexContainer>
      </Container>
    </>
  );
};
