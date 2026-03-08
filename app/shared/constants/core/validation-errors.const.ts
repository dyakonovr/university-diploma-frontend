export const ERROR_REQUIRED_FIELD = 'Поле не может быть пустым';

/** Поле должно быть длиной ${length} символов */
export const ERROR_LENGTH = (length: number) =>
  `Поле должно быть длиной ${length} символов`;
/** Поле не может быть длиной не менее ${minlength} символов */
export const ERROR_MIN_LENGTH = (minlength: number) =>
  `Поле не может быть длиной не менее ${minlength} символов`;
/** Поле не может быть длиной более ${maxlength} символов */
export const ERROR_MAX_LENGTH = (maxlength: number) =>
  `Поле не может быть длиной более ${maxlength} символов`;

/** Поле не может быть более, чем ${maxValue} */
export const ERROR_MORE_THAN = (maxValue: number) =>
  `Поле не может быть более, чем ${maxValue}`;
/** Поле должно быть >= ${maxValue} */
export const ERROR_MORE_OR_EQUAL = (maxValue: number) =>
  `Поле должно быть >= ${maxValue}`;
/** Поле не может быть менее, чем ${minValue} */
export const ERROR_LESS_THAN = (minValue: number) =>
  `Поле не может быть менее, чем ${minValue}`;
export const ERROR_LESS_OR_EQUAL = (minValue: number) =>
  `Поле должно быть <= ${minValue}`;
