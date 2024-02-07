import React from 'react';
import { useParams } from 'react-router-dom';

import { MainStyled } from '../../UI';
import { CategoriesStats, AccountStats } from '../../components';

export const AccountStatsPage = () => {
  const accountId = useParams().accountId!;

  return (
    <MainStyled>
      <CategoriesStats accountId={accountId} />
      <AccountStats accountId={accountId} />
    </MainStyled>
  );
};
