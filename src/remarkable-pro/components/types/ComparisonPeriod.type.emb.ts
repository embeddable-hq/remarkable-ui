import { defineOption, defineType } from '@embeddable.com/core';

const ComparisonPeriodType = defineType('comparisonPeriod', {
  label: 'Comparison Period',
  optionLabel: (value: string) => value,
});

defineOption(ComparisonPeriodType, 'Previous period');
defineOption(ComparisonPeriodType, 'Previous week');
defineOption(ComparisonPeriodType, 'Previous month');
defineOption(ComparisonPeriodType, 'Previous quarter');
defineOption(ComparisonPeriodType, 'Previous year');

export default ComparisonPeriodType;
