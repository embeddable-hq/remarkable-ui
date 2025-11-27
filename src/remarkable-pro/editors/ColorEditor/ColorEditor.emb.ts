import { defineEditor } from '@embeddable.com/react';
import ColorType from './Color.type.emb';
import { Value } from '@embeddable.com/core';

import Component from './index';

export const meta = {
  name: 'ColorEditor',
  label: 'Color Editor',
  type: ColorType,
};

/* @ts-expect-error - to be fixed in @embeddable.com/react */
export default defineEditor(Component, meta, {
  inputs: (value, setter) => {
    return {
      value,
      onChange: (val: string) => setter(Value.of(val)),
    };
  },
});
