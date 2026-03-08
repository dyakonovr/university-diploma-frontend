type SelectOptionValue = string | number | boolean | undefined | null;
export type SelectOption<Value = SelectOptionValue> = {
  label: string;
  value: Value;
};
