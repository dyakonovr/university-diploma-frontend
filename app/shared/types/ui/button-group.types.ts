export type ButtonGroupItem<Key extends string = string> = {
  label: string;
  key: Key;
};
export type ButtonGroupItems<Key extends string = string> =
  ButtonGroupItem<Key>[];
