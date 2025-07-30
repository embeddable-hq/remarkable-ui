import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import styles from './ChartCardMenu.module.css';
import { IconButton } from '../../../shared/IconButton/IconButton';
import { IconDotsVertical, IconLoader2 } from '@tabler/icons-react';
import React from 'react';
import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme';
import { ThemeChartsExportOptionActionProps } from '../../../../theme/theme';
import { Typography } from '../../../shared/Typography/Typography';

type ChartCardOptionsProps = ThemeChartsExportOptionActionProps;

export const ChartCardOptions: React.FC<ChartCardOptionsProps> = (props) => {
  const theme = useTheme() as Theme;
  const [isLoading, setIsLoading] = React.useState(false);

  const startExport = (exportFunction: () => void | Promise<void>) => {
    setIsLoading(true);
    setTimeout(() => {
      Promise.resolve(exportFunction()).finally(() => setIsLoading(false));
    }, 100);
  };

  const handleExport = (action: (props: ChartCardOptionsProps) => void) => {
    startExport(() => action(props));
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {isLoading ? (
          <IconLoader2 className={styles.loading} />
        ) : (
          <IconButton icon={IconDotsVertical} />
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className={styles.content}>
        {theme?.charts?.exportOptions?.map((option, index) => {
          return (
            <DropdownMenu.Item
              key={index}
              onSelect={() => handleExport(option.action)}
              className={styles.item}
            >
              <img src={option.iconSrc} className={styles.icon} />

              <Typography className={styles.label}>{option.label}</Typography>
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
