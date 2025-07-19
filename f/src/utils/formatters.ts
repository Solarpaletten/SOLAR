import { i18n } from 'i18next';

export const formatDate = (date: Date | string, i18n: i18n) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(i18n.language).format(dateObj);
};

export const formatAmount = (
  amount: number,
  currency: string = 'EUR',
  i18n: i18n
) => {
  return new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};
