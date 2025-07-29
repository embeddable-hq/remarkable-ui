import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import styles from './ChartCardOptions.module.css';
import { IconButton } from '../../../../shared/IconButton/IconButton';
import { IconDotsVertical, IconLoader2 } from '@tabler/icons-react';
import React from 'react';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../../theme';

type ChartCardOptionsProps = {
  title?: string;
  data?: DataResponse['data'];
  dimensions?: Dimension[];
  measures?: Measure[];
  containerRef?: React.RefObject<HTMLDivElement | null>;
};
export const ChartCardOptions: React.FC<ChartCardOptionsProps> = ({
  title,
  data,
  dimensions,
  measures,
  containerRef,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const theme = useTheme() as Theme;

  const startExport = (exportFunction: () => void | Promise<void>) => {
    setIsLoading(true);
    setTimeout(() => {
      Promise.resolve(exportFunction()).finally(() => setIsLoading(false));
    }, 100);
  };

  const customExport = (customExportFunction: (props: ChartCardOptionsProps) => void) => {
    startExport(() =>
      customExportFunction({
        title,
        measures,
        dimensions,
        data,
        containerRef,
      }),
    );
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
              onSelect={() => customExport(option.action)}
              className={styles.item}
            >
              {option.icon}
              <p>{option.label}</p>
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
