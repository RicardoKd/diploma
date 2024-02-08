import React from 'react';

import { DialogForm } from '../';
import { AppButton } from '../../UI';
import { formatLabel } from '../../utils';
import { QUERY_KEYS } from '../../constants';
import { ITransactionType } from '../../types';
import queryClient from '../../app/queryClient';
import { transactionService } from '../../services';
import { validationSchema } from './validationSchema';
import { CreateTransactionFormItems } from './CreateTransactionFormItems';
import { FormikCreateTransactionForm } from './FormikCreateTransactionForm';
import { useQuery } from 'react-query';

interface CreateTransactionFormProps {
  type: ITransactionType;
}

export const CreateTransactionForm: React.FC<CreateTransactionFormProps> = ({
  type,
}) => {
  const { data: incomeCategories, isSuccess: isIncomeCategoriesLoaded } =
    useQuery({
      keepPreviousData: true,
      queryKey: [QUERY_KEYS.INCOME_CATEGORIES],
      queryFn: () => transactionService.getCategories('income'),
    });

  const { data: spendCategories, isSuccess: isSpendCategoriesLoaded } =
    useQuery({
      keepPreviousData: true,
      queryKey: [QUERY_KEYS.SPEND_CATEGORIES],
      queryFn: () => transactionService.getCategories('spend'),
    });

  const [isOpen, setOpen] = React.useState(false);
  const accountId = queryClient.getQueryData<number>(
    QUERY_KEYS.CURRENT_ACCOUNT
  );
  const fields = [
    { formItem: CreateTransactionFormItems.NOTES },
    { formItem: CreateTransactionFormItems.RECORD_DATE, type: 'date' },
    { formItem: CreateTransactionFormItems.AMOUNT_OF_MONEY, type: 'number' },
    {
      formItem: CreateTransactionFormItems.CATEGORY,
      options:
        type === 'income' ? incomeCategories || [] : spendCategories || [],
    },
  ];

  return (
    <>
      <AppButton
        text={`Create ${type}`}
        onClick={() => setOpen(true)}
        disabled={
          type === 'income'
            ? !isIncomeCategoriesLoaded
            : !isSpendCategoriesLoaded
        }
      />
      <DialogForm
        isOpen={isOpen}
        fields={fields}
        formName={`Create ${type}`}
        handleClose={() => setOpen(false)}
        validationSchema={validationSchema}
        serviceMethodArgs={{ accountId, type }}
        errorMessage={`Failed to create ${type}`}
        successMessage={`${formatLabel(type)} created successfully`}
        initialValues={new FormikCreateTransactionForm()}
        serviceMethod={transactionService.createTransaction.bind(
          transactionService
        )}
        successCallback={() => {
          queryClient.refetchQueries([QUERY_KEYS.ACCOUNTS]);
          queryClient.refetchQueries([QUERY_KEYS.SPEND_STATS, accountId]);
          queryClient.refetchQueries([QUERY_KEYS.INCOME_STATS, accountId]);
          queryClient.refetchQueries([QUERY_KEYS.TRANSACTIONS, accountId]);
          queryClient.refetchQueries([
            QUERY_KEYS.ACCOUNT_TRANSACTIONS_STATS,
            accountId,
          ]);
        }}
      />
    </>
  );
};
