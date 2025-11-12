export const getTableCellWidthStyle = (width: number | undefined) => {
  return {
    minWidth: width ? `${width}px` : 'unset',
    maxWidth: width ? `${width}px` : 'unset',
    width: width ? `${width}px` : 'unset',
  };
};
