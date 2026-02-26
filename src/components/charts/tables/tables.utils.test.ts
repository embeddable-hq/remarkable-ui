import { describe, expect, it } from 'vitest';
import { getTableCellWidthStyle } from './tables.utils';

describe('getTableCellWidthStyle', () => {
  it('returns pixel values for all three width properties when width is provided', () => {
    const style = getTableCellWidthStyle(200);

    expect(style).toEqual({
      minWidth: '200px',
      maxWidth: '200px',
      width: '200px',
    });
  });

  it('returns "unset" for all three width properties when width is undefined', () => {
    const style = getTableCellWidthStyle(undefined);

    expect(style).toEqual({
      minWidth: 'unset',
      maxWidth: 'unset',
      width: 'unset',
    });
  });

  it('handles width of 0 as falsy, returning "unset"', () => {
    const style = getTableCellWidthStyle(0);

    expect(style).toEqual({
      minWidth: 'unset',
      maxWidth: 'unset',
      width: 'unset',
    });
  });

  it('handles non-integer widths', () => {
    const style = getTableCellWidthStyle(150.5);

    expect(style).toEqual({
      minWidth: '150.5px',
      maxWidth: '150.5px',
      width: '150.5px',
    });
  });
});
