import { i18n } from '../theme/i18n/i18n';

const resolveI18nString = (value: string): string => {
  if (!value.includes('|')) return value;

  const [key, fallback] = value.split('|', 2).map((part) => part.trim());
  return i18n.t([key, fallback].filter((v): v is string => !!v));
};

export const resolveI18nProps = <T extends object>(props: T): T => {
  const resolved = {} as T;

  (Object.keys(props) as Array<keyof T>).forEach((key) => {
    const value = props[key];
    resolved[key] = (typeof value === 'string' ? resolveI18nString(value) : value) as T[keyof T];
  });

  return resolved;
};
