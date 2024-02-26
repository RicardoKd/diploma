import React from 'react';
import { useQuery } from 'react-query';

import { DialogForm } from '../';
import { AppButton } from '../../UI';
import { FormItems } from './FormItems';
import { FormikForm } from './FormikForm';
import { formatLabel } from '../../utils';
import { QUERY_KEYS } from '../../constants';
import { TransactionType } from '../../types';
import queryClient from '../../app/queryClient';
import { transactionService } from '../../services';
import { ValidationSchema } from './ValidationSchema';

interface CreateTransactionFormProps {
  type: TransactionType;
}

export const CreateTransactionForm: React.FC<CreateTransactionFormProps> = ({
  type,
}) => {
  const { data: incomeCategories, isSuccess: isIncomeCategoriesLoaded } =
    useQuery({
      keepPreviousData: true,
      queryKey: [QUERY_KEYS.INCOME_CATEGORIES],
      queryFn: () => transactionService.getCategories({ type: 'income' }),
    });

  const { data: spendCategories, isSuccess: isSpendCategoriesLoaded } =
    useQuery({
      keepPreviousData: true,
      queryKey: [QUERY_KEYS.SPEND_CATEGORIES],
      queryFn: () => transactionService.getCategories({ type: 'spend' }),
    });

  const [isOpen, setOpen] = React.useState(false);
  const accountId = queryClient.getQueryData<number>(
    QUERY_KEYS.CURRENT_ACCOUNT
  );
  const fields = [
    { formItem: FormItems.NOTES },
    { formItem: FormItems.RECORD_DATE, type: 'date' },
    { formItem: FormItems.AMOUNT_OF_MONEY, type: 'number' },
    {
      formItem: FormItems.CATEGORY,
      options:
        type === 'income' ? incomeCategories || [] : spendCategories || [],
    },
  ];

  return (
    <>
      <AppButton
        onClick={() => setOpen(true)}
        disabled={
          type === 'income'
            ? !isIncomeCategoriesLoaded
            : !isSpendCategoriesLoaded
        }
      >
        Create {type}
      </AppButton>
      <DialogForm
        isOpen={isOpen}
        fields={fields}
        formName={`Create ${type}`}
        handleClose={() => setOpen(false)}
        validationSchema={ValidationSchema}
        errorMessage={`Failed to create ${type}`}
        initialValues={new FormikForm()}
        serviceMethodArgs={{ account_id: accountId, type }}
        successMessage={`${formatLabel(type)} created successfully`}
        serviceMethod={transactionService.createTransaction.bind(
          transactionService
        )}
        successCallback={() => {
          queryClient.refetchQueries([QUERY_KEYS.TRANSACTIONS, accountId]);
        }}
      />
    </>
  );
};
