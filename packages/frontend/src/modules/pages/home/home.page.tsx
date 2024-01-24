import React from 'react';
import { useQuery } from 'react-query';
import { Routes, Route } from 'react-router-dom';

import { AccountPage } from '../';
import { AppLoader } from '../../UI';
import { IAccount } from '../../types';
import { QUERY_KEYS, ROUTER_KEYS } from '../../constants';
import { AccountCardsContainer } from './home.page.styled';
import { accountService, transactionService } from '../../services';
import { Header, AccountCard, AccountStats } from '../../components';

export const HomePage = () => {
  const { isSuccess, data: accounts } = useQuery<IAccount[]>({
    keepPreviousData: true,
    queryKey: [QUERY_KEYS.ACCOUNTS],
    queryFn: () => accountService.getAccounts(),
  });

  const { isSuccess: incomeCategoriesLoaded } = useQuery({
    keepPreviousData: true,
    queryKey: [QUERY_KEYS.INCOME_CATEGORIES],
    queryFn: () => transactionService.getCategories('income'),
  });

  const { isSuccess: spendCategoriesLoaded } = useQuery({
    keepPreviousData: true,
    queryKey: [QUERY_KEYS.SPEND_CATEGORIES],
    queryFn: () => transactionService.getCategories('spend'),
  });

  return isSuccess ? (
    <>
      <Header />

      <Routes>
        <Route
          element={
            <AccountCardsContainer>
              {accounts.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </AccountCardsContainer>
          }
          path={ROUTER_KEYS.ANY}
        />
        {incomeCategoriesLoaded && spendCategoriesLoaded && (
          <>
            <Route
              element={<AccountStats />}
              path={`${ROUTER_KEYS.ACCOUNT_STATS}/:accountId`}
            />
            <Route
              element={<AccountPage />}
              path={`${ROUTER_KEYS.VIEW_ACCOUNT}/:accountTitle`}
            />
          </>
        )}
      </Routes>
    </>
  ) : (
    <AppLoader />
  );
};
