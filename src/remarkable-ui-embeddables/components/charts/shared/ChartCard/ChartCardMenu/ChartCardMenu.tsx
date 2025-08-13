import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import styles from './ChartCardMenu.module.css';
import { IconDotsVertical } from '@tabler/icons-react';
import React from 'react';
import { useTheme } from '@embeddable.com/react';
import { ChartCardLoading } from '../ChartCardLoading/ChartCardLoading';
import { i18n, i18nSetup } from '../../../../../theme/i18n/i18n';
import { Theme, ThemeChartsMenuOptionActionProps } from '../../../../../theme/theme.types';
import { IconButton, Typography } from '../../../../../../remarkable-ui';
import { RadixDropdownMenuContent } from '../../../../../third-party/radix';

type ChartCardMenuProps = ThemeChartsMenuOptionActionProps;

export const ChartCardMenu: React.FC<ChartCardMenuProps> = (props) => {
  const theme: Theme = useTheme() as Theme;
  i18nSetup(theme);

  const [isLoading, setIsLoading] = React.useState(false);

  const startAction = (onClick: () => void | Promise<void>) => {
    setIsLoading(true);
    setTimeout(() => {
      Promise.resolve(onClick()).finally(() => setIsLoading(false));
    }, 100);
  };

  const handleExport = (onClick: (props: ChartCardMenuProps) => void) => {
    startAction(() => onClick(props));
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {isLoading ? <ChartCardLoading /> : <IconButton icon={IconDotsVertical} />}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className={styles.content} side="bottom" align="end">
        <RadixDropdownMenuContent autoFocus>
          {theme.charts.menuOptions?.map((option, index) => {
            const label = i18n.t(option.labelKey);

            return (
              <DropdownMenu.Item
                key={index}
                onSelect={() => handleExport(option.onClick)}
                className={styles.item}
              >
                {option.iconSrc && (
                  <img src={option.iconSrc} className={styles.icon} alt={`${label} icon`} />
                )}
                <Typography className={styles.label}>{label}</Typography>
              </DropdownMenu.Item>
            );
          })}
        </RadixDropdownMenuContent>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
