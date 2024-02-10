import React from 'react';
import { useQuery } from 'react-query';

import { AppLoader, MainStyled } from '../../UI';
import { IAccount } from '../../types';
import { QUERY_KEYS } from '../../constants';
import { accountService } from '../../services';
import { Header, AccountCard } from '../../components';
import { AccountCardsContainer } from './home.page.styled';

export const HomePage = () => {
  const { isSuccess, data: accounts } = useQuery<IAccount[]>({
    keepPreviousData: true,
    queryKey: [QUERY_KEYS.ACCOUNTS],
    queryFn: () => accountService.getAccounts(),
  });

  return isSuccess ? (
    <>
      <Header title="Accounts" />
      <AccountCardsContainer>
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </AccountCardsContainer>
    </>
  ) : (
    <MainStyled>
      <AppLoader />
    </MainStyled>
  );
};
