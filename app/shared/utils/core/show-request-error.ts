import { RequestError } from '~/shared/errors/request.errors';

export function showRequestError(e: unknown) {
  if (e instanceof RequestError) {
    showError({
      statusCode: e.statusCode,
      data: { requestId: e.meta.request_id },
    });
  } else {
    showError({ statusCode: 500 });
  }
}
