import React from 'react';
import { useQuery } from 'react-query';
import { Container } from '@mui/system';

import { MUI } from '../../theme';
import { IAccount } from '../../types';
import { QUERY_KEYS } from '../../constants';
import { accountService } from '../../services';
import { AppLoader, FlexContainer } from '../../UI';
import { Header, AccountCard } from '../../components';

export const HomePage = () => {
  const { isSuccess, data: accounts } = useQuery<IAccount[]>({
    keepPreviousData: true,
    refetchOnMount: 'always',
    queryKey: [QUERY_KEYS.ACCOUNTS],
    queryFn: () => accountService.getAccounts(),
  });

  if (!isSuccess) {
    return <AppLoader />;
  }

  return (
    <>
      <Header title="Accounts" />
      <Container maxWidth={MUI.containerWidth}>
        <FlexContainer sx={{ flexWrap: 'wrap' }}>
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </FlexContainer>
      </Container>
    </>
  );
};
