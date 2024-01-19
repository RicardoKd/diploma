import React from 'react';

import { MainStyled } from '../../UI';
import { QUERY_KEYS } from '../../constants';
import queryClient from '../../app/queryClient';
import { transactionService } from '../../services';
import { validationSchema } from './validationSchema';
import { ICategory, ITransactionType } from '../../types';
import { Form } from '../../components/Form/Form.component';
import { CreateRecurringIncomeFormItems } from './CreateRecurringTransactionFormItems';
import { FormikCreateRecurringTransactionForm } from './FormikCreateRecurringTransactionForm';

interface CreateRecurringTransactionPageProps {
  type: ITransactionType;
}

export const CreateRecurringTransactionPage: React.FC<CreateRecurringTransactionPageProps> = ({
  type
}) => {
  const accountId = queryClient.getQueryData<number>(QUERY_KEYS.CURRENT_ACCOUNT);
  const incomeCategories = queryClient.getQueryData<ICategory[]>(QUERY_KEYS.INCOME_CATEGORIES);
  const spendCategories = queryClient.getQueryData<ICategory[]>(QUERY_KEYS.SPEND_CATEGORIES);
  const fields = [
    { formItem: CreateRecurringIncomeFormItems.NOTES },
    { formItem: CreateRecurringIncomeFormItems.START_DATE, type: 'date' },
    { formItem: CreateRecurringIncomeFormItems.END_DATE, type: 'date' },
    { formItem: CreateRecurringIncomeFormItems.AMOUNT_OF_MONEY, type: 'number' },
    { formItem: CreateRecurringIncomeFormItems.TIME_GAP_TYPE_VALUE, type: 'number' },
    {
      formItem: CreateRecurringIncomeFormItems.TIME_GAP_TYPE,
      options: [
        { label: 'Day', value: '1' },
        { label: 'Week', value: '2' },
        { label: 'Month', value: '3' },
        { label: 'Year', value: '4' }
      ]
    },
    {
      formItem: CreateRecurringIncomeFormItems.CATEGORY,
      options: (type === 'income' ? incomeCategories! : spendCategories!).map(({ id, title }) => ({
        label: title,
        value: id
      }))
    }
  ];

  return (
    <MainStyled>
      <Form
        fields={fields}
        validationSchema={validationSchema}
        serviceMethodArgs={{ accountId, type }}
        formName={`Create new recurring ${type}`}
        errorMessage={`Failed to create recurring ${type}`}
        successMessage={`Recurring ${type} created successfully`}
        initialValues={new FormikCreateRecurringTransactionForm()}
        // eslint-disable-next-line react/jsx-no-bind
        serviceMethod={transactionService.createRecurringTransaction.bind(transactionService)}
        successCallback={() => {
          queryClient.refetchQueries([QUERY_KEYS.RECURRING_SPENDS, accountId]);
          queryClient.refetchQueries([QUERY_KEYS.RECURRING_INCOMES, accountId]);
        }}
      />
    </MainStyled>
  );
};
