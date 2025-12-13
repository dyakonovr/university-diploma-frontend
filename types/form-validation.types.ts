export type BackendFormErrors<T> = {
  [K in keyof T]?: T[K] extends object 
    ? BackendFormErrors<T[K]>
    : string;
};
export type FormRules<T> = {
  [K in keyof T]?: T[K] extends object 
    ? FormRules<T[K]>
    : () => boolean;
};