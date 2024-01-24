export const getPostgresDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const postgresDateFormat = `${year}-${month}-${day}`;

  return postgresDateFormat;
};

export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatLabel = (label: string): string => {
  let formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);
  formattedLabel = formattedLabel.replaceAll('_', ' ');

  return formattedLabel;
};
