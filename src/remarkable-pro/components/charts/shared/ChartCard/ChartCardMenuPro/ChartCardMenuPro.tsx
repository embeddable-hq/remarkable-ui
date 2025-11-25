import { IconDotsVertical } from '@tabler/icons-react';
import React from 'react';
import { useTheme } from '@embeddable.com/react';
import { ChartCardLoading } from '../ChartCardLoading/ChartCardLoading';
import { i18n, i18nSetup } from '../../../../../theme/i18n/i18n';
import { Theme } from '../../../../../theme/theme.types';
import {
  Dropdown,
  ActionIcon,
  SelectFieldContent,
  SelectListOption,
} from '../../../../../../remarkable-ui';
import { ChartCardMenuProOptionOnClickProps } from './ChartCardMenuPro.types';
import styles from './ChartCardMenuPro.module.css';

type ChartCardMenuProProps = Omit<ChartCardMenuProOptionOnClickProps, 'theme'>;

export const ChartCardMenuPro: React.FC<ChartCardMenuProProps> = (props) => {
  const theme: Theme = useTheme() as Theme;
  i18nSetup(theme);

  const [isLoading, setIsLoading] = React.useState(false);

  const options = theme.charts?.chartCardMenuPro?.options ?? [];

  if (options.length === 0) {
    return null;
  }

  const startAction = (onClick: () => void | Promise<void>) => {
    setTimeout(() => {
      Promise.resolve(onClick()).finally(() => setIsLoading(false));
    }, 100);
  };

  const handleExport = (onClick: (props: ChartCardMenuProOptionOnClickProps) => void) => {
    setIsLoading(true);
    if (props.onCustomDownload) {
      props.onCustomDownload((args) => startAction(() => onClick(args)));
      return;
    }
    startAction(() => onClick({ ...props, theme }));
  };

  return (
    <Dropdown
      side="bottom"
      align="end"
      triggerComponent={isLoading ? <ChartCardLoading /> : <ActionIcon icon={IconDotsVertical} />}
    >
      <SelectFieldContent className={styles.list} autoFocus>
        {options.map((option, index) => {
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
      </SelectFieldContent>
    </Dropdown>
  );
};
