import React from 'react';
import { useParams } from 'react-router-dom';

import { MainStyled } from '../../UI';
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
        <CategoriesStats accountId={accountId} />
        <AccountTransactionsStats accountId={accountId} />
      </MainStyled>
    </>
  );
};
