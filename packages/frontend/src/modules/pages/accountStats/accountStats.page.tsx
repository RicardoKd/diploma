import React from 'react';
import { useParams } from 'react-router-dom';

import { FlexContainer } from '../../UI';
import { QUERY_KEYS } from '../../constants';
import { statsService } from '../../services';
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
      <FlexContainer sx={{ flexWrap: 'wrap' }}>
        <CategoriesStats
          queryKey={[QUERY_KEYS.CATEGORIES_BY_ACCOUNT_ID_STATS, accountId]}
          queryMethod={() =>
            statsService.getCategoriesStatsByAccountId({ accountId })
          }
        />
        <MonthlyIncomeSpendStats accountId={accountId} />
        <AccountTransactionsStats accountId={accountId} />
      </FlexContainer>
    </>
  );
};
