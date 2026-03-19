/**
 * Re-exports TinyMCE types from the self-hosted build in public/libs/tinymce-v7/.
 * This allows importing `type { Editor } from '~/shared/types/tinymce'`
 * instead of the broken `from 'public/libs/tinymce-v7/tinymce'`.
 */

/// <reference path="../../../public/libs/tinymce-v7/tinymce.d.ts" />

export type {
  Editor,
  EditorEvent,
  EditorManager,
  RawEditorOptions,
  TinyMCE,
} from '../../../public/libs/tinymce-v7/tinymce';

declare global {
  interface Window {
    tinymce: import('../../../public/libs/tinymce-v7/tinymce').TinyMCE;
  }
}
