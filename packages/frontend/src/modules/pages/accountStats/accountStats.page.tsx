import React from 'react';
import { useParams } from 'react-router-dom';

import { MainStyled } from '../../UI';
import { QUERY_KEYS } from '../../constants';
import { statsService } from '../../services';
import {
  Header,
  CategoriesStats,
  AccountTransactionsStats,
} from '../../components';

export const AccountStatsPage = () => {
  const accountId = useParams().accountId!;

  return (
    <>
      <Header title="Account Statistics" />
      <MainStyled>
        <CategoriesStats
          queryKey={[QUERY_KEYS.CATEGORIES_BY_ACCOUNT_ID_STATS, accountId]}
          queryMethod={() =>
            statsService.getCategoriesStatsByAccountId({ accountId })
          }
        />
        <AccountTransactionsStats accountId={accountId} />
      </MainStyled>
    </>
  );
};
