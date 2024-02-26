import React from 'react';
import { useQuery } from 'react-query';
import AddIcon from '@mui/icons-material/Add';
import { Container, CircularProgress, Fab } from '@mui/material';

import { IAccount } from '../../types';
import { FlexContainer } from '../../UI';
import { QUERY_KEYS } from '../../constants';
import { accountService } from '../../services';
import { Header, AccountCard, CreateAccountForm } from '../../components';

export const HomePage = () => {
  const [isAddAccountFormOpen, setAddAccountFormOpen] = React.useState(false);

  const { isSuccess, data: accounts } = useQuery<IAccount[]>({
    keepPreviousData: true,
    refetchOnMount: 'always',
    queryKey: [QUERY_KEYS.ACCOUNTS],
    queryFn: () => accountService.getAccounts(),
  });

  return (
    <>
      <Header />
      <Container component="main">
        <FlexContainer sx={{ flexWrap: 'wrap' }}>
          {isSuccess ? (
            accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))
          ) : (
            <CircularProgress />
          )}
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => setAddAccountFormOpen(true)}
          >
            <AddIcon />
          </Fab>
        </FlexContainer>
      </Container>
      <CreateAccountForm
        isOpen={isAddAccountFormOpen}
        setOpen={setAddAccountFormOpen}
      />
    </>
  );
};
