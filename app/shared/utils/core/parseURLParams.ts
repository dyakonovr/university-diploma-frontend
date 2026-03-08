export type PrimitiveType = 'string' | 'number' | 'boolean' | 'null';

type UnwrapArray<T> = T extends (infer U)[] ? U : T;

type InferPrimitive<T> =
  UnwrapArray<T> extends string | null ? 'string' :
  UnwrapArray<T> extends number | null ? 'number' :
  UnwrapArray<T> extends boolean | null ? 'boolean' :
  never;

export type URLParamsParsingConfigItem<
  K extends string = string,
  T extends PrimitiveType = PrimitiveType
> = {
  fieldName: K;
  type: T;
  isArray?: boolean;
};

export type URLParamsParsingConfig<T> = {
  [K in keyof T]-?: URLParamsParsingConfigItem<
    K & string,
    InferPrimitive<T[K]>
  > & (
    T[K] extends any[]
      ? { isArray: true }
      : { isArray?: false }
  )
}[keyof T][];

function parseSingle(value: string, type: PrimitiveType) {
  switch (type) {
    case 'string':
      return value;

    case 'number': {
      const num = Number(value);
      return Number.isNaN(num) ? undefined : num;
    }

    case 'boolean': {
      const normalized = value.toLowerCase();
      if (normalized === 'true' || normalized === '1') return true;
      if (normalized === 'false' || normalized === '0') return false;
      return undefined;
    }

    case 'null':
      return null;
  }
}

/** Утилита для парсинга URL-параметров. Поддерживает типы переменных:
  - string
  - number
  - boolean (1/0, true/false)
  - null
  
  Все типы поддерживают Array-формат. Пример конфига:
  ```
  const parsingConfig: URLParamsParsingConfig = [
      { fieldName: 'is_public', type: 'boolean' },
      { fieldName: 'name', type: 'string' },
      { fieldName: 'category_ids', type: 'string', isArray: true },
  ] as const;
  ```
  */
export function parseUrlParams<T extends Record<string, any>>(
  config: URLParamsParsingConfig<T>
): Partial<T> {
  const searchParams = new URLSearchParams(window.location.search);
  const result: Partial<T> = {};

  for (const item of config) {
    const { fieldName, type, isArray } = item;

    if (isArray) {
      const values = searchParams.getAll(fieldName);
      (result as any)[fieldName] = values
        .map((v) => parseSingle(v, type))
        .filter((v) => v !== undefined);
    } else {
      const value = searchParams.get(fieldName);
      if (value === null) continue;
      (result as any)[fieldName] = parseSingle(value, type);
    }
  }

  return result;
}