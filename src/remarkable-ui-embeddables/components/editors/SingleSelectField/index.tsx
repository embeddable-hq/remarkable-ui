import { DataResponse, Dimension } from '@embeddable.com/core';
import { SingleSelectField } from '../../../../remarkable-ui/editors/select/SingleSelectField/SingleSelectField';
import { getThemeFormatter } from '../../../theme/formatter/formatter.utils';
import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../theme/theme.types';

type SingleSelectFieldProProps = {
  title?: string;
  description?: string;
  dimension: Dimension;
  placeholder?: string;
  results: DataResponse;
  value: string;
  setSearchValue: (search: string) => void;
  onChange?: (selectedValue: string) => void;
};

const SingleSelectFieldPro = (props: SingleSelectFieldProProps) => {
  const theme: Theme = useTheme() as Theme;
  const themeFormatter = getThemeFormatter(theme);

  const options =
    props.results.data?.map((data) => ({
      value: data[props.dimension.name],
      label: themeFormatter.data(props.dimension, data[props.dimension.name]),
    })) ?? [];

  return (
    <SingleSelectField
      isLoading={props.results.isLoading}
      isClearable
      isSearchable
      value={props.value}
      options={options}
      onChange={(newValue) => props.onChange?.(newValue)}
      onSearch={props.setSearchValue}
    />
  );
};

export default SingleSelectFieldPro;
