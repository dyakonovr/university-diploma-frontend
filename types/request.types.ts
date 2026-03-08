export type QueryParams =
  | Record<string, string | number | string[] | number[]>
  | string;

export type JsonSerializable =
  | string
  | number
  | boolean
  | null
  | JsonSerializable[]
  | { [key: string]: JsonSerializable };

export type ResponseMeta = {
  currentPage: number;
  totalPages: number;
}

export type ResponseWithMeta<T> = { data: T; } & ResponseMeta;