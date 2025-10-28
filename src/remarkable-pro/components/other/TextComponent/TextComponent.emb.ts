import { EmbeddedComponentMeta, defineComponent } from '@embeddable.com/react';

import Component from './index';
import { Inputs } from '@embeddable.com/react';

export const meta = {
  name: 'TextComponent',
  label: 'Text Component',
  category: '_',
  defaultHeight: 100,
  defaultWidth: 400,
  inputs: [
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title for the chart',
    },
    {
      name: 'body',
      type: 'string',
      label: 'Body',
      description: 'The text content',
    },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      title: inputs.title,
      body: inputs.body,
    };
  },
});
