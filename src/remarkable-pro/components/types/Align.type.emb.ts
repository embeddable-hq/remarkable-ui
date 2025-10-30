import { defineOption, defineType } from '@embeddable.com/core';

const AlignType = defineType('align', {
  label: 'Align',
  optionLabel: (value: string) => value,
});

defineOption(AlignType, 'left');
defineOption(AlignType, 'center');
defineOption(AlignType, 'right');

export default AlignType;
