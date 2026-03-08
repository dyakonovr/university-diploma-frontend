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

export type ResponsePagination = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

export type ResponseMeta = {
  request_id: string;
};

export type Response<Data, AdditionalMeta = unknown> = {
  data: Data;
  meta: ResponseMeta & AdditionalMeta;
};

export type ResponseWithPagination<T> = Response<
  T,
  {
    pagination: ResponsePagination;
  }
>;
