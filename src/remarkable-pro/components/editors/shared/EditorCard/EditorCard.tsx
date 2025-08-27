import { useTheme } from '@embeddable.com/react';
import { i18n, i18nSetup } from '../../../../theme/i18n/i18n';
import styles from './EditorCard.module.css';
import { FC } from 'react';
import { Theme } from '../../../../theme/theme.types';
import { Card, CardContent, CardContentInfo, CardHeader } from '../../../../../remarkable-ui';
import { IconAlertCircle } from '@tabler/icons-react';

type EditorCardProps = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  errorMessage?: string;
};

export const EditorCard: FC<EditorCardProps> = ({
  title,
  subtitle,
  children,
  errorMessage,
  ...props
}) => {
  const theme: Theme = useTheme() as Theme;
  i18nSetup(theme);

  const getDisplay = () => {
    if (errorMessage) {
      return (
        <CardContentInfo
          className={styles.error}
          icon={IconAlertCircle}
          title={i18n.t('editors.errorTitle')}
          message={errorMessage}
        />
      );
    }

    return children;
  };

  return (
    <Card className={styles.card} {...props}>
      <CardHeader title={title} subtitle={subtitle} />
      <CardContent>{getDisplay()}</CardContent>
    </Card>
  );
};
