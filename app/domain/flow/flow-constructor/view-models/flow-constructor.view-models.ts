export type FlowConstructorUiState = {
  /** создано в UI, но не на сервере */
  is_new: boolean;
  /** изменено после последнего сохранения */
  is_dirty: boolean;
  /** UUID нужен для корректной отрисовки дерева. Используется в `:key` и `id="entity-${uuid}" (для якорей)` */
  uuid: string;
  /** свёрнут ли блок в аккордеоне */
  is_collapsed?: boolean;
};
