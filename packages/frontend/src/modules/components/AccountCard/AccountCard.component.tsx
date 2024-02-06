import React from 'react';
import { useMutation } from 'react-query';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Card,
  Divider,
  Typography,
  CardContent,
  CardActions,
} from '@mui/material';

import { COLORS } from '../../theme';
import { IAccount } from '../../types';
import queryClient from '../../app/queryClient';
import { accountService } from '../../services';
import { AppButton, RouterLink } from '../../UI';
import { QUERY_KEYS, ROUTER_KEYS } from '../../constants';
import { currencyFormatter, showError, showSuccess } from '../../utils';

const accountCardButtonStyle = {
  ':hover': {
    borderWidth: '2px',
    padding: '4.6px 11px',
    color: COLORS.lightPurple,
    borderColor: COLORS.lightPurple,
  },
};

interface AccountsCardProps {
  account: IAccount;
}

export const AccountCard: React.FC<AccountsCardProps> = ({ account }) => {
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
        minWidth: 300,
        margin: '20px',
        padding: '5px',
        color: COLORS.white,
        background: COLORS.black,
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Divider sx={{ borderColor: COLORS.purple }} />
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Typography variant="body1">Balance:</Typography>
          <Typography variant="body1">
            {currencyFormatter.format(balance)}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <RouterLink
          sx={accountCardButtonStyle}
          text="View"
          onClick={() =>
            queryClient.setQueryData(QUERY_KEYS.CURRENT_ACCOUNT, id)
          }
          to={`${ROUTER_KEYS.HOME}${ROUTER_KEYS.VIEW_ACCOUNT}/${id}`}
        />
        <RouterLink
          sx={accountCardButtonStyle}
          text="Statistics"
          to={`${ROUTER_KEYS.HOME}${ROUTER_KEYS.ACCOUNT_STATS}/${id}`}
        />
        <AppButton
          sx={accountCardButtonStyle}
          onClick={() => deleteMutation.mutate({ id })}
        >
          <DeleteIcon />
        </AppButton>
      </CardActions>
    </Card>
  );
};
