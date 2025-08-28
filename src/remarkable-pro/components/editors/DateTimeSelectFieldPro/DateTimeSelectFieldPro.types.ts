export type DateTimeSelectFieldOptionGetRangeReturn = {
  from: Date;
  to: Date;
};

export type DateTimeSelectFieldOption = {
  label: string;
  value: string;
  dateFormat?: string;
  getRange?: () => DateTimeSelectFieldOptionGetRangeReturn;
};
