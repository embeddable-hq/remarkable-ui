type GroupedOptions<T> = {
  [category: string]: T[];
};

export const groupOptionsByCategory = <T extends { label: string; category?: string }>(
  options: T[],
): GroupedOptions<T> | null => {
  const result = options.reduce<GroupedOptions<T>>((acc, option) => {
    if (option.category) {
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
