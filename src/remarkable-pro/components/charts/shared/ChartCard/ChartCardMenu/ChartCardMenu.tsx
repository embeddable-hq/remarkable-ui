import { IconDotsVertical } from '@tabler/icons-react';
import React from 'react';
import { useTheme } from '@embeddable.com/react';
import { ChartCardLoading } from '../ChartCardLoading/ChartCardLoading';
import { i18n, i18nSetup } from '../../../../../theme/i18n/i18n';
import { Theme, ThemeChartsMenuOptionActionProps } from '../../../../../theme/theme.types';
import {
  Dropdown,
  IconButton,
  SelectList,
  SelectListOption,
} from '../../../../../../remarkable-ui';

type ChartCardMenuProps = Omit<ThemeChartsMenuOptionActionProps, 'theme'>;

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

  const handleExport = (onClick: (props: ThemeChartsMenuOptionActionProps) => void) => {
    startAction(() => onClick({ ...props, theme }));
  };

  return (
    <Dropdown
      triggerComponent={isLoading ? <ChartCardLoading /> : <IconButton icon={IconDotsVertical} />}
    >
      <SelectList autoFocus autoWidth>
        {theme.charts?.menuOptions?.map((option, index) => {
          const label = i18n.t(option.labelKey);

          return (
            <SelectListOption
              key={index}
              label={label}
              onClick={() => handleExport(option.onClick)}
              startIcon={
                option.iconSrc ? <img src={option.iconSrc} alt={`${label} icon`} /> : undefined
              }
            />
          );
        })}
      </SelectList>
    </Dropdown>
  );
};
