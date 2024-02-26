import React from 'react';
import { useQuery } from 'react-query';

import { DialogForm } from '../';
import { AppButton } from '../../UI';
import { FormItems } from './FormItems';
import { FormikForm } from './FormikForm';
import { formatLabel } from '../../utils';
import queryClient from '../../app/queryClient';
import { transactionService } from '../../services';
import { ValidationSchema } from './ValidationSchema';
import { IFormField, TransactionType } from '../../types';
import {
  QUERY_KEYS,
  TIME_GAP_TYPES_OPTIONS,
  TOOLTIP_TEXT,
} from '../../constants';

interface CreateRecurringTransactionFormPageProps {
  type: TransactionType;
}

export const CreateRecurringTransactionForm: React.FC<
  CreateRecurringTransactionFormPageProps
> = ({ type }) => {
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

  const fields: IFormField[] = [
    { formItem: FormItems.NOTES },
    { formItem: FormItems.START_DATE, type: 'date' },
    { formItem: FormItems.END_DATE, type: 'date' },
    {
      formItem: FormItems.AMOUNT_OF_MONEY,
      type: 'number',
    },
    {
      formItem: FormItems.TIME_GAP_TYPE_VALUE,
      type: 'number',
      tooltipText: TOOLTIP_TEXT.timeGapTypeValue,
    },
    {
      formItem: FormItems.TIME_GAP_TYPE,
      options: TIME_GAP_TYPES_OPTIONS,
      tooltipText: TOOLTIP_TEXT.timeGapType,
    },
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
      >{`Create recurring ${type}`}</AppButton>
      <DialogForm
        isOpen={isOpen}
        fields={fields}
        handleClose={() => setOpen(false)}
        validationSchema={ValidationSchema}
        formName={`Create recurring ${type}`}
        serviceMethodArgs={{ accountId, type }}
        errorMessage={`Failed to create recurring ${type}`}
        successMessage={`Recurring ${formatLabel(type)} created successfully`}
        initialValues={new FormikForm()}
        serviceMethod={transactionService.createRecurringTransaction.bind(
          transactionService
        )}
        successCallback={() => {
          queryClient.refetchQueries([
            QUERY_KEYS.RECURRING_TRANSACTIONS,
            accountId,
          ]);
        }}
      />
    </>
  );
};
