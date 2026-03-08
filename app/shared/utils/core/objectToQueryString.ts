import type { JsonSerializable } from '~/shared/types/core/request.types';

export function objectToQueryString(
  obj: JsonSerializable,
  prefix: string = '',
): string {
  if (typeof obj !== 'object' || obj === null) {
    throw new Error('Expected an object');
  }

  return Object.keys(obj as { [key: string]: JsonSerializable })
    .filter(
      (key) =>
        (obj as { [key: string]: JsonSerializable })[key] !== null &&
        (obj as { [key: string]: JsonSerializable })[key] !== undefined,
    )
    .map((key) => {
      const newPrefix = prefix
        ? `${prefix}[${encodeURIComponent(key)}]`
        : encodeURIComponent(key);
      const value = (obj as { [key: string]: JsonSerializable })[key];
      if (Array.isArray(value)) {
        const parts: string[] = [];
        value.forEach((val) => {
          if (typeof val === 'object' && val !== null) {
            parts.push(
              objectToQueryString(val as JsonSerializable, `${newPrefix}[]`),
            );
          } else {
            parts.push(`${newPrefix}[]=${encodeURIComponent(val as string)}`);
          }
        });
        return parts.join('&');
      }

      if (typeof value === 'object' && value !== null) {
        return objectToQueryString(value as JsonSerializable, newPrefix);
      }

      return `${newPrefix}=${encodeURIComponent(value as string)}`;
    })
    .join('&');
}
