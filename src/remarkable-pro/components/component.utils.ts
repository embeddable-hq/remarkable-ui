import { i18n } from '../theme/i18n/i18n';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const resolveI18nString = (value: string, args?: Record<string, any>): string => {
  if (!value || !value.includes('|')) return i18n.t(value, args);

  const [key, fallback] = value.split('|', 2).map((part) => part.trim());
  return i18n.t(
    [key, fallback].filter((v): v is string => !!v),
    args,
  );
};

export const resolveI18nProps = <T extends object>(props: T): T => {
  const resolved = {} as T;

  (Object.keys(props) as Array<keyof T>).forEach((key) => {
    const value = props[key];
    resolved[key] = (typeof value === 'string' ? resolveI18nString(value) : value) as T[keyof T];
  });

  return resolved;
};
