export type FieldProps<T> = Partial<Omit<T, 'modelValue' | 'label' | 'name'>>;

export type EditorElementProps = {
  disabled?: boolean;
  isHtmlContentEditor?: boolean;
};

export type FormItemEditorElementProps = FieldProps<EditorElementProps>;
