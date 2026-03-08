export type TableViewActiveSortButton = {
  prop: string;
  dir: 'asc' | 'desc';
} | null;

export type TableViewHeaderColumn = {
  prop: string;
  label: string | Component;
  minWidth?: number;
  maxWidth?: number;
  width?: number;
  sortable?: boolean;
  sortableProp?: string;
  fixed?: 'right';
};