import { OrderBy, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component from './index';

export type TestComponentProps = {
  title: string;
  description: string;
};

export const meta = {
  name: 'TestComponent',
  label: 'Test Component',
  category: 'Charts',
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
    },
    {
        name: 'description',
        type: 'string',
        label: 'Description',
      },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs
    };
  },
});
