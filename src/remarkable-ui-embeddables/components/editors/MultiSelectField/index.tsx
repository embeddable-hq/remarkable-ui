import { DataResponse, Dimension } from '@embeddable.com/core';
import { getThemeFormatter } from '../../../theme/formatter/formatter.utils';
import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../theme/theme.types';
import { EditorCard } from '../shared/EditorCard/EditorCard';
import { resolveI18nProps } from '../../component.utils';
import { i18n } from '../../../theme/i18n/i18n';
import { MultiSelectField } from '../../../../remarkable-ui';

export const MAX_OPTIONS = 200;

type MultiSelectFieldProProps = {
  title?: string;
  description?: string;
  dimension: Dimension;
  optionalSecondDimension?: Dimension;
  placeholder?: string;
  results: DataResponse;
  selectedValues: string[];
  maxOptions?: number;
  setSearchValue: (search: string) => void;
  onChange?: (newValues: string[]) => void;
};

const MuiltiSelectFieldPro = (props: MultiSelectFieldProProps) => {
  const theme: Theme = useTheme() as Theme;
  const themeFormatter = getThemeFormatter(theme);
  const {
    title,
    description,
    dimension,
    optionalSecondDimension,
    placeholder,
    results,
    selectedValues,
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
      <MultiSelectField
        isClearable
        isSearchable
        isLoading={results.isLoading}
        values={selectedValues ?? []}
        options={options}
        placeholder={placeholder}
        noOptionsMessage={showNoOptionsMessage ? i18n.t('common.noOptionsFound') : undefined}
        onChange={(newValues) => onChange?.(newValues)}
        onSearch={setSearchValue}
      />
    </EditorCard>
  );
};

export default MuiltiSelectFieldPro;
