import React from 'react';

import { DialogForm } from '../';
import { AppButton } from '../../UI';
import { formatLabel } from '../../utils';
import queryClient from '../../app/queryClient';
import { transactionService } from '../../services';
import { validationSchema } from './validationSchema';
import { ICategory, ITransactionType } from '../../types';
import { QUERY_KEYS, TIME_GAP_TYPES_OPTIONS } from '../../constants';
import { CreateRecurringIncomeFormItems } from './CreateRecurringTransactionFormItems';
import { FormikCreateRecurringTransactionForm } from './FormikCreateRecurringTransactionForm';

interface CreateRecurringTransactionFormPageProps {
  type: ITransactionType;
}

export const CreateRecurringTransactionForm: React.FC<
  CreateRecurringTransactionFormPageProps
> = ({ type }) => {
  const [isOpen, setOpen] = React.useState(false);
  const accountId = queryClient.getQueryData<number>(
    QUERY_KEYS.CURRENT_ACCOUNT
  );
  const incomeCategories = queryClient.getQueryData<ICategory[]>(
    QUERY_KEYS.INCOME_CATEGORIES
  );
  const spendCategories = queryClient.getQueryData<ICategory[]>(
    QUERY_KEYS.SPEND_CATEGORIES
  );
  const fields = [
    { formItem: CreateRecurringIncomeFormItems.NOTES },
    { formItem: CreateRecurringIncomeFormItems.START_DATE, type: 'date' },
    { formItem: CreateRecurringIncomeFormItems.END_DATE, type: 'date' },
    {
      formItem: CreateRecurringIncomeFormItems.AMOUNT_OF_MONEY,
      type: 'number',
    },
    {
      formItem: CreateRecurringIncomeFormItems.TIME_GAP_TYPE_VALUE,
      type: 'number',
    },
    {
      formItem: CreateRecurringIncomeFormItems.TIME_GAP_TYPE,
      options: TIME_GAP_TYPES_OPTIONS,
    },
    {
      formItem: CreateRecurringIncomeFormItems.CATEGORY,
      options: (type === 'income' ? incomeCategories! : spendCategories!).map(
        ({ id, title }) => ({
          label: title,
          value: id,
        })
      ),
    },
  ];

  return (
    <>
      <AppButton
        text={`Create recurring ${type}`}
        onClick={() => setOpen(true)}
      />
      <DialogForm
        isOpen={isOpen}
        fields={fields}
        handleClose={() => setOpen(false)}
        validationSchema={validationSchema}
        formName={`Create recurring ${type}`}
        serviceMethodArgs={{ accountId, type }}
        errorMessage={`Failed to create recurring ${type}`}
        successMessage={`Recurring ${formatLabel(type)} created successfully`}
        initialValues={new FormikCreateRecurringTransactionForm()}
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
