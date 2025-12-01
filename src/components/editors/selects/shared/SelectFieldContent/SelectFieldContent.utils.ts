import {
  SelectListOptionProps,
  SelectListOptionPropsWithCategory,
} from './SelectFieldOptions/SelectFieldOption/SelectFieldOption';

type GroupedOptions = {
  [category: string]: SelectListOptionPropsWithCategory[];
};

export const groupOptionsByCategory = (
  options: (SelectListOptionProps | SelectListOptionPropsWithCategory)[],
): GroupedOptions | null => {
  const result = options.reduce<GroupedOptions>((acc, option) => {
    if ('category' in option && option.category) {
      const category = option.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(option);
    }
    return acc;
  }, {});

  // Return null if no categories were found
  return Object.keys(result).length === 0 ? null : result;
};
