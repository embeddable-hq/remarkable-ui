import { DataResponse, Dimension } from '@embeddable.com/core';
import { SingleSelectField } from '../../../../remarkable-ui/editors/select/SingleSelectField/SingleSelectField';
import { getThemeFormatter } from '../../../theme/formatter/formatter.utils';
import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../theme/theme.types';
import { EditorCard } from '../shared/EditorCard/EditorCard';
import { resolveI18nProps } from '../../component.utils';

type SingleSelectFieldProProps = {
  title?: string;
  description?: string;
  dimension: Dimension;
  optionalSecondDimension?: Dimension;
  placeholder?: string;
  results: DataResponse;
  selectedValue: string;
  setSearchValue: (search: string) => void;
  onChange?: (selectedValue: string) => void;
};

const SingleSelectFieldPro = (props: SingleSelectFieldProProps) => {
  const theme: Theme = useTheme() as Theme;
  const themeFormatter = getThemeFormatter(theme);

  const {
    title,
    description,
    dimension,
    optionalSecondDimension,
    placeholder,
    results,
    selectedValue,
    setSearchValue,
    onChange,
  } = resolveI18nProps(props);

  const options =
    results.data?.map((data) => {
      return {
        value: optionalSecondDimension ? data[optionalSecondDimension.name] : data[dimension.name],
        label: themeFormatter.data(dimension, data[dimension.name]),
      };
    }) ?? [];

  return (
    <EditorCard title={title} subtitle={description}>
      <SingleSelectField
        placeholder={placeholder}
        isLoading={results.isLoading}
        isClearable
        isSearchable
        value={selectedValue}
        options={options}
        onChange={(newValue) => onChange?.(newValue)}
        onSearch={setSearchValue}
      />
    </EditorCard>
  );
};

export default SingleSelectFieldPro;
