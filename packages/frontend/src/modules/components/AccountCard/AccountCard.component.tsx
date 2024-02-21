import React from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Card,
  Divider,
  Typography,
  CardContent,
  CardActions,
} from '@mui/material';

import { AppButton } from '../../UI';
import { IAccount } from '../../types';
import queryClient from '../../app/queryClient';
import { accountService } from '../../services';
import { BORDER_RADIUS, SPACES } from '../../theme';
import { QUERY_KEYS, ROUTER_KEYS } from '../../constants';
import { currencyFormatter, showError, showSuccess } from '../../utils';

interface AccountsCardProps {
  account: IAccount;
}

export const AccountCard: React.FC<AccountsCardProps> = ({ account }) => {
  const navigate = useNavigate();
  const { id, title, balance } = account;

  const onChangeSuccess = () => {
    showSuccess(`Account "${title}" deleted`);
    queryClient.refetchQueries(QUERY_KEYS.ACCOUNTS);
  };

  const deleteMutation = useMutation(
    accountService.deleteById.bind(accountService),
    {
      onSuccess: () => onChangeSuccess(),
      onError: () => showError('Failed to delete account'),
    }
  );

  return (
    <Card
      sx={{
        maxWidth: 400,
        minWidth: 320,
        margin: SPACES.m,
        padding: SPACES.sm,
        borderRadius: BORDER_RADIUS,
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Divider
          sx={{ borderColor: 'secondary.main', marginBottom: SPACES.m }}
        />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography>Balance:</Typography>
          <Typography>{currencyFormatter.format(balance)}</Typography>
        </Box>
      </CardContent>
      <CardActions>
        <AppButton
          onClick={() => {
            queryClient.setQueryData(QUERY_KEYS.CURRENT_ACCOUNT, id);
            navigate(`${ROUTER_KEYS.ACCOUNT}/${id}`);
          }}
        >
          View
        </AppButton>
        <AppButton
          onClick={() => navigate(`${ROUTER_KEYS.ACCOUNT_STATS}/${id}`)}
        >
          Statistics
        </AppButton>
        <AppButton onClick={() => deleteMutation.mutate({ id })}>
          <DeleteIcon />
        </AppButton>
      </CardActions>
    </Card>
  );
};
