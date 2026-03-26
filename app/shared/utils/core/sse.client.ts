import { navigateTo } from '#app';
import { useCustomToast } from '~/shared/composables/useCustomToast';

import { API_BASES, API_PREFIX } from './request.client';

export interface SSEClientOptions {
  baseUrl: keyof typeof API_BASES;
  url: string;
  body?: Record<string, unknown>;
  onEvent: (event: string, data: string) => void;
  onError?: (error: Error) => void;
  onDone?: () => void;
  signal?: AbortSignal;
}

/**
 * Creates an SSE client for POST endpoints that stream server-sent events.
 *
 * Uses raw `fetch()` with `ReadableStream` to parse SSE protocol from POST responses,
 * since the standard `EventSource` API only supports GET requests.
 *
 * @example
 * createSSEClient({
 *   baseUrl: 'MAIN',
 *   url: '/workspaces/123/command/stream',
 *   body: { text: 'создай задачу' },
 *   onEvent(event, data) {
 *     if (event === 'status') console.log(JSON.parse(data));
 *   },
 *   onDone() { console.log('stream finished'); },
 * });
 */
export async function createSSEClient(options: SSEClientOptions): Promise<void> {
  const { baseUrl, url, body, onEvent, onError, onDone, signal } = options;
  const { toastError } = useCustomToast();

  const fullUrl = API_BASES[baseUrl] + API_PREFIX + url;

  let response: Response;
  try {
    response = await fetch(fullUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
      signal,
    });
  } catch (err) {
    if ((err as Error).name === 'AbortError') return;
    onError?.(err as Error);
    return;
  }

  if (response.status === 401) {
    toastError('Сессия истекла');
    await navigateTo('/auth/login');
    return;
  }

  if (!response.ok) {
    onError?.(new Error(`HTTP ${response.status}`));
    return;
  }

  if (!response.body) {
    onError?.(new Error('Response body is empty'));
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // SSE events are separated by double newlines
      const parts = buffer.split('\n\n');
      // Last part may be incomplete — keep it in buffer
      buffer = parts.pop() || '';

      for (const part of parts) {
        if (!part.trim()) continue;

        let eventName = 'message';
        let eventData = '';

        for (const line of part.split('\n')) {
          if (line.startsWith('event:')) {
            eventName = line.slice(6).trim();
          } else if (line.startsWith('data:')) {
            eventData = line.slice(5).trim();
          }
        }

        if (eventName === 'done') {
          onDone?.();
          return;
        }

        if (eventName === 'error') {
          try {
            const parsed = JSON.parse(eventData);
            onError?.(new Error(parsed.message || 'SSE error'));
          } catch {
            onError?.(new Error(eventData || 'SSE error'));
          }
          return;
        }

        onEvent(eventName, eventData);
      }
    }

    // Stream ended without explicit 'done' event
    onDone?.();
  } catch (err) {
    if ((err as Error).name === 'AbortError') return;
    onError?.(err as Error);
  }
}
