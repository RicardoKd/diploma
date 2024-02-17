import React from 'react';
import { useParams } from 'react-router-dom';

import { QUERY_KEYS } from '../../constants';
import { statsService } from '../../services';
import { MainStyled, StatsContainer } from '../../UI';
import {
  Header,
  CategoriesStats,
  MonthlyIncomeSpendStats,
  AccountTransactionsStats,
} from '../../components';

export const AccountStatsPage = () => {
  const accountId = useParams().accountId!;

  return (
    <>
      <Header title="Account Statistics" />
      <MainStyled>
        <StatsContainer>
          <CategoriesStats
            queryKey={[QUERY_KEYS.CATEGORIES_BY_ACCOUNT_ID_STATS, accountId]}
            queryMethod={() =>
              statsService.getCategoriesStatsByAccountId({ accountId })
            }
          />
          <MonthlyIncomeSpendStats accountId={accountId} />
          <AccountTransactionsStats accountId={accountId} />
        </StatsContainer>
      </MainStyled>
    </>
  );
};
