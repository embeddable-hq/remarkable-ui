import { useTheme } from '@embeddable.com/react';
import { SingleSelectField } from '../../../../remarkable-ui';
import { Theme } from '../../../theme/theme.types';
import { useLoadDayjsLocale } from '../../../utils.ts/date.utils';
import { getDateTimeSelectFieldProOptions } from './DateTimeSelectFieldPro.utils';

const DateTimeSelectField = () => {
  const theme: Theme = useTheme() as Theme;
  const { dayjsLocalReady } = useLoadDayjsLocale();

  if (!dayjsLocalReady) {
    return null;
  }

  const options = getDateTimeSelectFieldProOptions(theme);

  return <SingleSelectField value={''} onChange={console.log} options={options} />;
};

export default DateTimeSelectField;
