import React from 'react';

import { MainStyled } from '../../UI';
import { QUERY_KEYS } from '../../constants';
import queryClient from '../../app/queryClient';
import { transactionService } from '../../services';
import { validationSchema } from './validationSchema';
import { ICategory, ITransactionType } from '../../types';
import { Form } from '../../components/Form/Form.component';
import { CreateTransactionFormItems } from './CreateTransactionFormItems';
import { FormikCreateTransactionForm } from './FormikCreateTransactionForm';

interface CreateTransactionPageProps {
  type: ITransactionType;
}

export const CreateTransactionPage: React.FC<CreateTransactionPageProps> = ({ type }) => {
  const accountId = queryClient.getQueryData<number>(QUERY_KEYS.CURRENT_ACCOUNT);
  const spendCategories = queryClient.getQueryData<ICategory[]>(QUERY_KEYS.SPEND_CATEGORIES);
  const incomeCategories = queryClient.getQueryData<ICategory[]>(QUERY_KEYS.INCOME_CATEGORIES);
  const fields = [
    { formItem: CreateTransactionFormItems.NOTES },
    { formItem: CreateTransactionFormItems.RECORD_DATE, type: 'date' },
    { formItem: CreateTransactionFormItems.AMOUNT_OF_MONEY, type: 'number' },
    {
      formItem: CreateTransactionFormItems.CATEGORY,
      options: (type === 'income' ? incomeCategories! : spendCategories!).map(({ _id, title }) => ({
        label: title,
        value: `${_id}`
      }))
    }
  ];

  return (
    <MainStyled>
      <Form
        fields={fields}
        formName={`Create new ${type}`}
        validationSchema={validationSchema}
        serviceMethodArgs={{ accountId, type }}
        errorMessage={`Failed to create ${type}`}
        successMessage={`${type} created successfully`}
        initialValues={new FormikCreateTransactionForm()}
        // eslint-disable-next-line react/jsx-no-bind
        serviceMethod={transactionService.createTransaction.bind(transactionService)}
        successCallback={() => {
          queryClient.refetchQueries([QUERY_KEYS.ACCOUNTS]);
          queryClient.refetchQueries([QUERY_KEYS.SPEND_STATS, accountId]);
          queryClient.refetchQueries([QUERY_KEYS.INCOME_STATS, accountId]);
          queryClient.refetchQueries([QUERY_KEYS.TRANSACTIONS, accountId]);
        }}
      />
    </MainStyled>
  );
};
