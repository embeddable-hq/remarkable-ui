import { DataResponse, Dimension } from '@embeddable.com/core';
import { getThemeFormatter } from '../../../theme/formatter/formatter.utils';
import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../theme/theme.types';
import { EditorCard } from '../shared/EditorCard/EditorCard';
import { resolveI18nProps } from '../../component.utils';
import { i18n } from '../../../theme/i18n/i18n';
import { SingleSelectField } from '../../../../remarkable-ui';

export const MAX_OPTIONS = 200;

type SingleSelectFieldProProps = {
  title?: string;
  description?: string;
  dimension: Dimension;
  optionalSecondDimension?: Dimension;
  placeholder?: string;
  results: DataResponse;
  selectedValue: string;
  maxOptions?: number;
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

  const showNoOptionsMessage = Boolean(!results.isLoading && (results.data?.length ?? 0) === 0);

  return (
    <EditorCard title={title} subtitle={description}>
      <SingleSelectField
        clearable
        searchable
        isLoading={results.isLoading}
        value={selectedValue}
        options={options}
        placeholder={placeholder}
        noOptionsMessage={showNoOptionsMessage ? i18n.t('common.noOptionsFound') : undefined}
        onChange={(newValue: string) => onChange?.(newValue)}
        onSearch={setSearchValue}
      />
    </EditorCard>
  );
};

export default SingleSelectFieldPro;
