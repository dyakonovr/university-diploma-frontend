export type FormErrors<T> = {
  [K in keyof T]?: T[K] extends unknown[]
    ? string
    : T[K] extends Date
      ? string
      : T[K] extends File
        ? string
        : T[K] extends object
          ? FormErrors<T[K]>
          : string;
};

export type FormFields<T> = {
  [K in keyof T]: T[K] | null;
};

export type FormRules<T> = {
  [K in keyof T]?: T[K] extends unknown[]
    ? () => boolean
    : T[K] extends Date
      ? () => boolean
      : T[K] extends File ? () => boolean : 
      T[K] extends object
        ? FormRules<T[K]>
        : () => boolean;
};
